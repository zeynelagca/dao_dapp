from odoo import api, fields, models, _
from odoo.exceptions import ValidationError


class SpaDonation(models.Model):
    _name = 'spa.donation'
    _description = 'Bağış'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'donation_date desc, id desc'

    name = fields.Char(string='Bağış Adı', required=True)
    sequence_no = fields.Char(string='Bağış No', copy=False, readonly=True, default='Yeni')
    school_id = fields.Many2one('spa.school', string='Okul', required=True)
    union_term_id = fields.Many2one('spa.union.term', string='Birlik Dönemi', required=True)
    donation_date = fields.Date(string='Bağış Tarihi', required=True, default=fields.Date.context_today)
    donor_id = fields.Many2one('res.partner', string='Bağışçı')
    donor_name_manual = fields.Char(string='Bağışçı Adı (Elle)')
    donation_type = fields.Selection([
        ('cash', 'Nakit'),
        ('in_kind', 'Ayni'),
        ('sponsorship', 'Sponsorluk'),
        ('event_income', 'Etkinlik Geliri'),
        ('other', 'Diğer'),
    ], string='Bağış Türü', required=True, default='cash')
    amount = fields.Float(string='Tutar')
    description = fields.Text(string='Açıklama')
    document_attachment_count = fields.Integer(related='message_attachment_count', string='Ek Sayısı', readonly=True)
    tefbis_ready = fields.Boolean(string='TEFBİS Hazır')
    state = fields.Selection([
        ('draft', 'Taslak'),
        ('confirmed', 'Onaylandı'),
        ('cancelled', 'İptal'),
    ], string='Durum', default='draft', tracking=True)
    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('sequence_no', 'Yeni') == 'Yeni':
                vals['sequence_no'] = self.env['ir.sequence'].next_by_code('spa.donation') or 'Yeni'
        return super().create(vals_list)

    @api.constrains('donation_type', 'amount')
    def _check_cash_amount(self):
        for rec in self:
            if rec.donation_type == 'cash' and rec.amount <= 0:
                raise ValidationError(_('Nakit bağışlarda tutar sıfırdan büyük olmalıdır.'))

    @api.onchange('donor_id')
    def _onchange_donor_id(self):
        if self.donor_id:
            self.donor_name_manual = False

    def action_confirm(self):
        self.write({'state': 'confirmed'})
        treasurer_group = self.env.ref('school_parent_association.group_spa_treasurer', raise_if_not_found=False)
        users = treasurer_group.users if treasurer_group else self.env['res.users']
        for rec in self:
            for user in users:
                rec.activity_schedule(
                    'mail.mail_activity_data_todo',
                    user_id=user.id,
                    summary=_('Bağış işlensin'),
                    note=_('%s numaralı bağış onaylandı, mali kayıtlara işlenmelidir.') % rec.sequence_no,
                )

    def action_cancel(self):
        self.write({'state': 'cancelled'})


class SpaExpenseRequest(models.Model):
    _name = 'spa.expense.request'
    _description = 'Gider Talebi'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'request_date desc, id desc'

    name = fields.Char(string='Talep Adı', required=True)
    sequence_no = fields.Char(string='Talep No', copy=False, readonly=True, default='Yeni')
    school_id = fields.Many2one('spa.school', string='Okul', required=True)
    union_term_id = fields.Many2one('spa.union.term', string='Birlik Dönemi', required=True)
    request_date = fields.Date(string='Talep Tarihi', required=True, default=fields.Date.context_today)
    requested_by_id = fields.Many2one('res.users', string='Talep Eden', required=True, default=lambda self: self.env.user)
    category = fields.Char(string='Kategori', required=True)
    description = fields.Text(string='Açıklama', required=True)
    estimated_amount = fields.Float(string='Tahmini Tutar', required=True)
    approved_amount = fields.Float(string='Onaylı Tutar')
    decision_id = fields.Many2one('spa.decision', string='Dayanak Karar')
    vendor_id = fields.Many2one('res.partner', string='Tedarikçi')
    payment_state = fields.Selection([
        ('not_paid', 'Ödenmedi'),
        ('partially_paid', 'Kısmen Ödendi'),
        ('paid', 'Ödendi'),
    ], string='Ödeme Durumu', default='not_paid', tracking=True)
    state = fields.Selection([
        ('draft', 'Taslak'),
        ('submitted', 'Gönderildi'),
        ('approved', 'Onaylandı'),
        ('rejected', 'Reddedildi'),
        ('paid', 'Ödendi'),
        ('cancelled', 'İptal'),
    ], default='draft', string='Durum', tracking=True)

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('sequence_no', 'Yeni') == 'Yeni':
                vals['sequence_no'] = self.env['ir.sequence'].next_by_code('spa.expense.request') or 'Yeni'
        return super().create(vals_list)

    @api.constrains('estimated_amount', 'approved_amount')
    def _check_amount_threshold(self):
        for rec in self:
            if rec.estimated_amount < 0 or rec.approved_amount < 0:
                raise ValidationError(_('Tutar alanları negatif olamaz.'))
            limit = rec.estimated_amount * 1.2 if rec.estimated_amount else 0
            if rec.approved_amount and rec.estimated_amount and rec.approved_amount > limit and rec.state != 'approved':
                raise ValidationError(_('Onaylı tutar tahmini tutarın %120 üstündeyse kayıt onay durumunda olmalıdır.'))

    def action_submit(self):
        self.write({'state': 'submitted'})
        for rec in self:
            users = rec.school_id.principal_id
            president_group = self.env.ref('school_parent_association.group_spa_president', raise_if_not_found=False)
            if president_group:
                users |= president_group.users
            for user in users:
                rec.activity_schedule(
                    'mail.mail_activity_data_todo',
                    user_id=user.id,
                    summary=_('Gider talebi onayı bekliyor'),
                    note=_('%s numaralı gider talebi onay bekliyor.') % rec.sequence_no,
                )

    def action_approve(self):
        self.write({'state': 'approved'})

    def action_reject(self):
        self.write({'state': 'rejected'})

    def action_mark_paid(self):
        self.write({'state': 'paid', 'payment_state': 'paid'})

    def action_cancel(self):
        self.write({'state': 'cancelled'})
