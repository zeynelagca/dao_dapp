from odoo import api, fields, models, _
from odoo.exceptions import ValidationError


class SpaMeeting(models.Model):
    _name = 'spa.meeting'
    _description = 'Toplantı'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'date desc, id desc'

    name = fields.Char(string='Toplantı Adı', required=True, tracking=True)
    sequence_no = fields.Char(string='Toplantı No', copy=False, readonly=True, default='Yeni')
    school_id = fields.Many2one('spa.school', string='Okul', required=True, tracking=True)
    union_term_id = fields.Many2one('spa.union.term', string='Birlik Dönemi', required=True)
    meeting_type = fields.Selection([
        ('general_assembly', 'Genel Kurul'),
        ('management_board', 'Yönetim Kurulu'),
        ('audit_board', 'Denetim Kurulu'),
        ('class_representatives', 'Sınıf Temsilcileri'),
        ('other', 'Diğer'),
    ], string='Toplantı Türü', required=True, default='management_board')
    date = fields.Datetime(string='Tarih', required=True, default=fields.Datetime.now)
    location = fields.Char(string='Konum')
    attendee_ids = fields.Many2many('res.partner', string='Katılımcılar')
    attendee_count = fields.Integer(string='Katılımcı Sayısı', compute='_compute_attendee_count', store=True)
    quorum_count = fields.Integer(string='Toplantı Yeter Sayısı')
    notes = fields.Html(string='Notlar')
    agenda_line_ids = fields.One2many('spa.meeting.agenda', 'meeting_id', string='Gündem Maddeleri')
    decision_ids = fields.One2many('spa.decision', 'meeting_id', string='Kararlar')
    state = fields.Selection([
        ('draft', 'Taslak'),
        ('confirmed', 'Onaylandı'),
        ('done', 'Tamamlandı'),
        ('cancelled', 'İptal'),
    ], string='Durum', default='draft', tracking=True)

    @api.depends('attendee_ids')
    def _compute_attendee_count(self):
        for rec in self:
            rec.attendee_count = len(rec.attendee_ids)

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('sequence_no', 'Yeni') == 'Yeni':
                vals['sequence_no'] = self.env['ir.sequence'].next_by_code('spa.meeting') or 'Yeni'
        return super().create(vals_list)

    def button_confirm(self):
        self.write({'state': 'confirmed'})

    def button_done(self):
        self.write({'state': 'done'})

    def button_cancel(self):
        self.write({'state': 'cancelled'})


class SpaMeetingAgenda(models.Model):
    _name = 'spa.meeting.agenda'
    _description = 'Toplantı Gündem Maddesi'
    _order = 'sequence, id'

    meeting_id = fields.Many2one('spa.meeting', string='Toplantı', required=True, ondelete='cascade')
    sequence = fields.Integer(string='Sıra', default=10)
    title = fields.Char(string='Başlık', required=True)
    description = fields.Text(string='Açıklama')


class SpaDecision(models.Model):
    _name = 'spa.decision'
    _description = 'Karar'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'decision_date desc, id desc'

    name = fields.Char(string='Karar Adı', required=True)
    sequence_no = fields.Char(string='Karar No', copy=False, readonly=True, default='Yeni')
    meeting_id = fields.Many2one('spa.meeting', string='Toplantı')
    school_id = fields.Many2one('spa.school', string='Okul', required=True)
    union_term_id = fields.Many2one('spa.union.term', string='Birlik Dönemi', required=True)
    decision_date = fields.Date(string='Karar Tarihi', required=True, default=fields.Date.context_today)
    subject = fields.Char(string='Konu', required=True)
    description = fields.Text(string='Açıklama')
    related_model = fields.Char(string='İlgili Model')
    related_res_id = fields.Integer(string='İlgili Kayıt ID')
    amount = fields.Float(string='Tutar')
    state = fields.Selection([
        ('draft', 'Taslak'),
        ('approved', 'Onaylı'),
        ('cancelled', 'İptal'),
    ], default='draft', tracking=True)

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            if vals.get('sequence_no', 'Yeni') == 'Yeni':
                vals['sequence_no'] = self.env['ir.sequence'].next_by_code('spa.decision') or 'Yeni'
        return super().create(vals_list)

    @api.onchange('meeting_id')
    def _onchange_meeting_id(self):
        if self.meeting_id:
            self.school_id = self.meeting_id.school_id
            self.union_term_id = self.meeting_id.union_term_id
            self.decision_date = fields.Date.to_date(self.meeting_id.date)

    @api.constrains('meeting_id', 'decision_date')
    def _check_decision_date(self):
        for rec in self.filtered('meeting_id'):
            if rec.decision_date and rec.meeting_id.date and rec.decision_date < fields.Date.to_date(rec.meeting_id.date):
                raise ValidationError(_('Karar tarihi toplantı tarihinden önce olamaz.'))

    def action_approve(self):
        self.write({'state': 'approved'})

    def action_cancel(self):
        self.write({'state': 'cancelled'})
