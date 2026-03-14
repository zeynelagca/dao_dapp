from odoo import api, fields, models, _


class SpaNeedRequest(models.Model):
    _name = 'spa.need.request'
    _description = 'İhtiyaç Talebi'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'request_date desc, id desc'

    name = fields.Char(string='Talep Başlığı', required=True)
    school_id = fields.Many2one('spa.school', string='Okul', required=True)
    union_term_id = fields.Many2one('spa.union.term', string='Birlik Dönemi', required=True)
    request_source = fields.Selection([
        ('teacher', 'Öğretmen'),
        ('class_representative', 'Sınıf Temsilcisi'),
        ('administration', 'İdare'),
        ('parent', 'Veli'),
    ], string='Talep Kaynağı', required=True)
    requested_by_partner_id = fields.Many2one('res.partner', string='Talep Eden Kişi')
    requested_by_user_id = fields.Many2one('res.users', string='Talep Eden Kullanıcı')
    category = fields.Char(string='Kategori', required=True)
    priority = fields.Selection([
        ('low', 'Düşük'),
        ('medium', 'Orta'),
        ('high', 'Yüksek'),
        ('urgent', 'Acil'),
    ], default='medium', string='Öncelik')
    request_date = fields.Date(string='Talep Tarihi', default=fields.Date.context_today, required=True)
    description = fields.Text(string='Açıklama', required=True)
    estimated_budget = fields.Float(string='Tahmini Bütçe')
    expense_request_id = fields.Many2one('spa.expense.request', string='Bağlı Gider Talebi', readonly=True)
    state = fields.Selection([
        ('draft', 'Taslak'),
        ('submitted', 'Gönderildi'),
        ('under_review', 'İncelemede'),
        ('approved', 'Onaylandı'),
        ('converted', 'Gidere Dönüştürüldü'),
        ('rejected', 'Reddedildi'),
        ('done', 'Tamamlandı'),
    ], default='draft', string='Durum', tracking=True)

    def action_submit(self):
        self.write({'state': 'submitted'})

    def action_under_review(self):
        self.write({'state': 'under_review'})

    def action_approve(self):
        self.write({'state': 'approved'})

    def action_reject(self):
        self.write({'state': 'rejected'})

    def action_done(self):
        self.write({'state': 'done'})

    def action_convert_to_expense(self):
        self.ensure_one()
        expense = self.env['spa.expense.request'].create({
            'name': _('İhtiyaçtan Dönüşen Gider - %s') % self.name,
            'school_id': self.school_id.id,
            'union_term_id': self.union_term_id.id,
            'category': self.category,
            'description': self.description,
            'estimated_amount': self.estimated_budget or 0.0,
            'requested_by_id': self.requested_by_user_id.id or self.env.user.id,
        })
        self.write({'expense_request_id': expense.id, 'state': 'converted'})
        return {
            'type': 'ir.actions.act_window',
            'res_model': 'spa.expense.request',
            'res_id': expense.id,
            'view_mode': 'form',
            'target': 'current',
        }


class SpaEvent(models.Model):
    _name = 'spa.event'
    _description = 'Etkinlik'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'event_date desc, id desc'

    name = fields.Char(string='Etkinlik Adı', required=True)
    school_id = fields.Many2one('spa.school', string='Okul', required=True)
    union_term_id = fields.Many2one('spa.union.term', string='Birlik Dönemi', required=True)
    event_type = fields.Selection([
        ('kermes', 'Kermes'),
        ('trip', 'Gezi'),
        ('seminar', 'Seminer'),
        ('ceremony', 'Tören'),
        ('graduation', 'Mezuniyet'),
        ('sports', 'Spor'),
        ('arts', 'Sanat'),
        ('social_help', 'Sosyal Yardım'),
        ('other', 'Diğer'),
    ], string='Etkinlik Türü', required=True, default='other')
    event_date = fields.Date(string='Etkinlik Tarihi', required=True)
    location = fields.Char(string='Lokasyon')
    responsible_partner_id = fields.Many2one('res.partner', string='Sorumlu')
    budget_amount = fields.Float(string='Bütçe')
    income_amount = fields.Float(string='Gelir')
    expense_amount = fields.Float(string='Gider')
    notes = fields.Text(string='Notlar')
    state = fields.Selection([
        ('draft', 'Taslak'),
        ('planned', 'Planlandı'),
        ('ongoing', 'Devam Ediyor'),
        ('done', 'Tamamlandı'),
        ('cancelled', 'İptal'),
    ], string='Durum', default='draft', tracking=True)

    donation_count = fields.Integer(string='Bağışlar', compute='_compute_finance_counts')
    expense_count = fields.Integer(string='Giderler', compute='_compute_finance_counts')

    @api.depends('union_term_id')
    def _compute_finance_counts(self):
        for rec in self:
            rec.donation_count = self.env['spa.donation'].search_count([('union_term_id', '=', rec.union_term_id.id)])
            rec.expense_count = self.env['spa.expense.request'].search_count([('union_term_id', '=', rec.union_term_id.id)])

    def action_view_donations(self):
        self.ensure_one()
        action = self.env['ir.actions.act_window']._for_xml_id('school_parent_association.spa_donation_action')
        action['domain'] = [('union_term_id', '=', self.union_term_id.id)]
        return action

    def action_view_expenses(self):
        self.ensure_one()
        action = self.env['ir.actions.act_window']._for_xml_id('school_parent_association.spa_expense_request_action')
        action['domain'] = [('union_term_id', '=', self.union_term_id.id)]
        return action
