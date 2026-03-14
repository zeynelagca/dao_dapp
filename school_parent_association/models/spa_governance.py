from datetime import timedelta

from odoo import api, fields, models, _
from odoo.exceptions import ValidationError


class SpaMemberRole(models.Model):
    _name = 'spa.member.role'
    _description = 'Üye Rolü'

    name = fields.Char(string='Rol Adı', required=True, translate=True)
    code = fields.Char(string='Kod', required=True)

    _sql_constraints = [
        ('spa_member_role_code_unique', 'unique(code)', 'Rol kodu benzersiz olmalıdır.'),
    ]


class SpaBoardMember(models.Model):
    _name = 'spa.board.member'
    _description = 'Kurul Üyesi'

    union_term_id = fields.Many2one('spa.union.term', string='Birlik Dönemi', required=True, ondelete='cascade')
    partner_id = fields.Many2one('res.partner', string='Üye', required=True)
    role_id = fields.Many2one('spa.member.role', string='Rol', required=True)
    board_type = fields.Selection([
        ('management', 'Yönetim'),
        ('audit', 'Denetim'),
        ('representative', 'Temsilci'),
    ], string='Kurul Türü', required=True, default='management')
    date_start = fields.Date(string='Başlangıç Tarihi')
    date_end = fields.Date(string='Bitiş Tarihi')
    active = fields.Boolean(default=True)

    @api.constrains('date_start', 'date_end')
    def _check_date_range(self):
        for rec in self:
            if rec.date_start and rec.date_end and rec.date_start > rec.date_end:
                raise ValidationError(_('Kurul üyesi bitiş tarihi başlangıç tarihinden önce olamaz.'))


class SpaAnnouncement(models.Model):
    _name = 'spa.announcement'
    _description = 'Duyuru'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'publish_date desc, id desc'

    name = fields.Char(string='Başlık', required=True, tracking=True)
    school_id = fields.Many2one('spa.school', string='Okul', required=True)
    union_term_id = fields.Many2one('spa.union.term', string='Birlik Dönemi')
    target_scope = fields.Selection([
        ('all_parents', 'Tüm Veliler'),
        ('class_representatives', 'Sınıf Temsilcileri'),
        ('teachers', 'Öğretmenler'),
        ('board_members', 'Kurul Üyeleri'),
        ('custom', 'Özel Hedef Kitle'),
    ], string='Hedef Kitle', default='all_parents', required=True)
    publish_date = fields.Date(string='Yayın Tarihi', required=True, default=fields.Date.context_today)
    expiry_date = fields.Date(string='Bitiş Tarihi')
    content_html = fields.Html(string='İçerik')
    active = fields.Boolean(default=True)

    @api.constrains('publish_date', 'expiry_date')
    def _check_expiry_dates(self):
        for rec in self:
            if rec.publish_date and rec.expiry_date and rec.expiry_date < rec.publish_date:
                raise ValidationError(_('Duyuru bitiş tarihi yayın tarihinden önce olamaz.'))

    @api.model
    def cron_archive_expired_announcements(self):
        today = fields.Date.today()
        expired = self.search([('active', '=', True), ('expiry_date', '!=', False), ('expiry_date', '<', today)])
        expired.write({'active': False})


class SpaAuditNote(models.Model):
    _name = 'spa.audit.note'
    _description = 'Denetim Notu'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _order = 'note_date desc, id desc'

    school_id = fields.Many2one('spa.school', string='Okul', required=True)
    union_term_id = fields.Many2one('spa.union.term', string='Birlik Dönemi')
    note_date = fields.Date(string='Not Tarihi', required=True, default=fields.Date.context_today)
    note_type = fields.Selection([
        ('document_missing', 'Eksik Evrak'),
        ('payment_issue', 'Ödeme Sorunu'),
        ('process_issue', 'Süreç Sorunu'),
        ('tefbis_mismatch', 'TEFBİS Uyuşmazlığı'),
        ('other', 'Diğer'),
    ], string='Not Türü', required=True)
    reference_model = fields.Char(string='Referans Model')
    reference_res_id = fields.Integer(string='Referans Kayıt ID')
    description = fields.Text(string='Açıklama', required=True)
    action_required = fields.Text(string='Gerekli Aksiyon')
    resolved = fields.Boolean(string='Çözüldü', default=False, tracking=True)
    resolved_date = fields.Date(string='Çözüm Tarihi')

    def action_mark_resolved(self):
        self.write({'resolved': True, 'resolved_date': fields.Date.today()})

    @api.model
    def cron_unresolved_audit_notes(self):
        threshold = fields.Date.today() - timedelta(days=14)
        notes = self.search([('resolved', '=', False), ('note_date', '<=', threshold)])
        group = self.env.ref('school_parent_association.group_spa_auditor', raise_if_not_found=False)
        users = group.users if group else self.env['res.users']
        for note in notes:
            for user in users:
                note.activity_schedule(
                    'mail.mail_activity_data_todo',
                    user_id=user.id,
                    summary=_('Bekleyen denetim notu'),
                    note=_('14 günden eski çözümlenmemiş denetim notu bulunmaktadır.'),
                )


class SpaTefbisExport(models.Model):
    _name = 'spa.tefbis.export'
    _description = 'TEFBİS Dışa Aktarım Yardımcısı'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string='Ad', required=True, copy=False, default='Yeni')
    school_id = fields.Many2one('spa.school', string='Okul', required=True)
    union_term_id = fields.Many2one('spa.union.term', string='Birlik Dönemi', required=True)
    export_date = fields.Date(string='Dışa Aktarım Tarihi', default=fields.Date.context_today, required=True)
    export_type = fields.Selection([
        ('income', 'Gelir'),
        ('expense', 'Gider'),
        ('mixed', 'Karma'),
    ], string='Dışa Aktarım Türü', required=True, default='mixed')
    line_count = fields.Integer(string='Satır Sayısı', readonly=True)
    data_json = fields.Text(string='JSON Veri')
    state = fields.Selection([
        ('draft', 'Taslak'),
        ('generated', 'Oluşturuldu'),
        ('exported', 'Dışa Aktarıldı'),
    ], string='Durum', default='draft', tracking=True)

    def action_generate(self):
        for rec in self:
            data = []
            if rec.export_type in ('income', 'mixed'):
                donations = self.env['spa.donation'].search([
                    ('union_term_id', '=', rec.union_term_id.id),
                    ('state', '=', 'confirmed'),
                ])
                data += [{'tip': 'gelir', 'kayit': d.sequence_no, 'tutar': d.amount} for d in donations]
            if rec.export_type in ('expense', 'mixed'):
                expenses = self.env['spa.expense.request'].search([
                    ('union_term_id', '=', rec.union_term_id.id),
                    ('state', 'in', ('approved', 'paid')),
                ])
                data += [{'tip': 'gider', 'kayit': e.sequence_no, 'tutar': e.approved_amount} for e in expenses]
            rec.write({'data_json': str(data), 'line_count': len(data), 'state': 'generated'})

    def action_mark_exported(self):
        self.write({'state': 'exported'})


class SpaUnionTermCronMixin(models.Model):
    _inherit = 'spa.union.term'

    @api.model
    def cron_terms_near_end(self):
        limit_date = fields.Date.today() + timedelta(days=30)
        terms = self.search([('state', '=', 'active'), ('date_end', '<=', limit_date)])
        for term in terms:
            users = self.env.ref('school_parent_association.group_spa_admin').users
            for user in users:
                term.activity_schedule(
                    'mail.mail_activity_data_todo',
                    user_id=user.id,
                    summary=_('Dönem bitişi yaklaşıyor'),
                    note=_('%s dönemi 30 gün içinde sona erecek.') % term.name,
                )
