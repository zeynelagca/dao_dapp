from odoo import api, fields, models, _
from odoo.exceptions import ValidationError


class SpaSchool(models.Model):
    _name = 'spa.school'
    _description = 'Okul'
    _order = 'name'

    name = fields.Char(string='Okul Adı', required=True)
    code = fields.Char(string='Okul Kodu', required=True)
    school_type = fields.Selection([
        ('kindergarten', 'Anaokulu'),
        ('primary', 'İlkokul'),
        ('highschool', 'Lise'),
    ], string='Okul Türü', required=True, default='primary')
    principal_id = fields.Many2one('res.users', string='Müdür')
    partner_id = fields.Many2one('res.partner', string='İlişkili Kişi')
    active = fields.Boolean(default=True)

    _sql_constraints = [
        ('spa_school_code_unique', 'unique(code)', 'Okul kodu benzersiz olmalıdır.'),
    ]


class SpaAcademicYear(models.Model):
    _name = 'spa.academic.year'
    _description = 'Akademik Yıl'
    _order = 'date_start desc'

    name = fields.Char(string='Ad', required=True)
    date_start = fields.Date(string='Başlangıç Tarihi', required=True)
    date_end = fields.Date(string='Bitiş Tarihi', required=True)
    active = fields.Boolean(default=True)

    @api.constrains('date_start', 'date_end')
    def _check_dates(self):
        for record in self:
            if record.date_start and record.date_end and record.date_start >= record.date_end:
                raise ValidationError(_('Akademik yıl başlangıç tarihi bitiş tarihinden önce olmalıdır.'))


class SpaUnionTerm(models.Model):
    _name = 'spa.union.term'
    _description = 'Birlik Dönemi'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'date_start desc, id desc'

    name = fields.Char(string='Dönem Adı', required=True, tracking=True)
    school_id = fields.Many2one('spa.school', string='Okul', required=True, tracking=True)
    academic_year_id = fields.Many2one('spa.academic.year', string='Akademik Yıl', required=True)
    date_start = fields.Date(string='Başlangıç', required=True)
    date_end = fields.Date(string='Bitiş', required=True)
    state = fields.Selection([
        ('draft', 'Taslak'),
        ('active', 'Aktif'),
        ('closed', 'Kapalı'),
    ], string='Durum', default='draft', tracking=True)
    chairman_id = fields.Many2one('res.partner', string='Başkan')
    treasurer_id = fields.Many2one('res.partner', string='Sayman')
    notes = fields.Text(string='Notlar')

    meeting_count = fields.Integer(compute='_compute_counts', string='Toplantı Sayısı')
    donation_count = fields.Integer(compute='_compute_counts', string='Bağış Sayısı')
    expense_count = fields.Integer(compute='_compute_counts', string='Gider Sayısı')
    event_count = fields.Integer(compute='_compute_counts', string='Etkinlik Sayısı')

    @api.depends('name')
    def _compute_counts(self):
        for rec in self:
            rec.meeting_count = self.env['spa.meeting'].search_count([('union_term_id', '=', rec.id)])
            rec.donation_count = self.env['spa.donation'].search_count([('union_term_id', '=', rec.id)])
            rec.expense_count = self.env['spa.expense.request'].search_count([('union_term_id', '=', rec.id)])
            rec.event_count = self.env['spa.event'].search_count([('union_term_id', '=', rec.id)])

    @api.constrains('date_start', 'date_end')
    def _check_date_range(self):
        for record in self:
            if record.date_start and record.date_end and record.date_start > record.date_end:
                raise ValidationError(_('Dönem başlangıcı bitişten sonra olamaz.'))

    @api.constrains('school_id', 'state')
    def _check_single_active_per_school(self):
        for record in self.filtered(lambda r: r.state == 'active' and r.school_id):
            domain = [
                ('id', '!=', record.id),
                ('school_id', '=', record.school_id.id),
                ('state', '=', 'active'),
            ]
            if self.search_count(domain):
                raise ValidationError(_('Her okul için yalnızca bir aktif birlik dönemi olabilir.'))

    def action_activate(self):
        self.write({'state': 'active'})

    def action_close(self):
        self.write({'state': 'closed'})

    def action_set_draft(self):
        self.write({'state': 'draft'})

    def action_view_meetings(self):
        return self._get_action('spa_meeting_action', 'spa.meeting')

    def action_view_donations(self):
        return self._get_action('spa_donation_action', 'spa.donation')

    def action_view_expenses(self):
        return self._get_action('spa_expense_request_action', 'spa.expense.request')

    def action_view_events(self):
        return self._get_action('spa_event_action', 'spa.event')

    def _get_action(self, xmlid, model_name):
        self.ensure_one()
        action = self.env['ir.actions.act_window']._for_xml_id(f'school_parent_association.{xmlid}')
        action['domain'] = [('union_term_id', '=', self.id)]
        action['context'] = {'default_union_term_id': self.id, 'default_school_id': self.school_id.id}
        return action
