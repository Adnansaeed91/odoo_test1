{
    'name': 'ETA Integration',
    'version': '14.0.1.0.0',
    'category': 'Website',
    'summary': 'This Module   connects Odoo 14 community with Egyptian Tax Authority',
    'description': """
    This Module   connects Odoo 14 community with Egyptian Tax Authority
    """,
    'sequence': 1,
    'author': 'Hassan Ali',
    'website': '',
    'depends': ['purchase','account','save_signtatures'],
    'data': [
        'security/account_security.xml',
        'security/ir.model.access.csv',
        'views/auth_signup_extend_views.xml',
        'views/res_partner_view.xml',
        'views/purchase.xml',
        'views/eta_api.xml',
        'views/server_action_invoice.xml'
    ],
    'images': [
        'static/description/auth_signup_banner.png',
    ],
    'demo': [],
    'installable': True,
    'auto_install': False,
    'application': True,
    'license': 'LGPL-3'
}
