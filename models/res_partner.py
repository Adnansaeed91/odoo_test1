from odoo import fields, models
import requests
import  ssl
from odoo.tools.translate import _
from odoo.exceptions import  UserError
import json
from datetime import datetime



class MessageWizard(models.TransientModel):
    _name = 'message.wizard'

    message = fields.Text('Message', required=True)


    def action_ok(self):
        """ close wizard"""
        return {'type': 'ir.actions.act_window_close'}


class ResPartner(models.Model):
    _inherit = "res.partner"

    corporate_name = fields.Char('Corporate Name')



class EtaApi(models.Model):
    _name = "eta.api"
    _description = "ETA APi"

    name=fields.Char('Instance Name')
    client_id=fields.Char('Client ID',required=True)
    client_secret=fields.Char("Client Secret",required=True)
    access_token=fields.Char("Access Token",size=2000)

    def connect_eta_api(self):
        _create_unverified_https_context = ssl._create_unverified_context
        url = "https://id.preprod.eta.gov.eg/connect/token"

        payload = 'grant_type=client_credentials' \
                  '&client_id='+self.client_id+'' \
                  '&client_secret='+self.client_secret+'' \
                  '&scope=InvoicingAPI'
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        response = requests.request("POST", url, headers=headers, data=payload,verify=False)
        if response.status_code==200:
            res=json.loads(response.text)
            eta_api_model = self.search([("client_id", "=", self.client_id)])

            eta_api_model.sudo().write({"access_token":res['access_token']})

            # self.access_token=res['access_token']
            # don't forget to add translation support to your message _()
            #raise UserError(_("ETA APi is Connected Successfully"))
            message_id = self.env['message.wizard'].create({'message': _("ETA APi is Connected Successfully")})
            return {
                'name': _('Successfull'),
                'type': 'ir.actions.act_window',
                'view_mode': 'form',
                'res_model': 'message.wizard',
                # pass the id
                'res_id': message_id.id,
                'target': 'new'
            }
        else:
            err=str(response.status_code,response.reason)
            message_id = self.env['message.wizard'].create({'message': _(err)})
            return {
                'name': _('Successfull'),
                'type': 'ir.actions.act_window',
                'view_mode': 'form',
                'res_model': 'message.wizard',
                # pass the id
                'res_id': message_id.id,
                'target': 'new'
            }
    def get_eta_document_types(self):
        _create_unverified_https_context = ssl._create_unverified_context
        url = "https://api.preprod.invoicing.eta.gov.eg/api/v1/documenttypes"
        eta_api_model = self.search([("client_id", "=", self.client_id)])
        access_token=str(eta_api_model.access_token)
        payload = {}
        headers = {
            'Accept-Language': 'ar',
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer "+access_token
        }

        response = requests.request("GET", url, headers=headers, data=payload,verify=False)
        self.env['eta.document.types'].sudo().create({

            'eta_id': '1',
            'name': 'dsad',
            'description': 'dsad',
            'activeFrom': "2021-03-30 10:50:23",
            'activeTo': "2021-03-30 10:50:23"

        })

        if response.status_code==200:
            document_types=json.loads(response.text)
            for document_type in document_types['result']:
                document_id=document_type['id']
                document_name=document_type['name']
                document_description=document_type['description']
                raw_activeFrom=str(document_type['activeFrom'])[:-1]
                activeTo=''
                if document_type['activeTo'] !=None:

                    raw_activeTo=str(document_type['activeTo'])[:-1]
                    activeTo = datetime.fromisoformat(raw_activeTo)
                activeFrom=datetime.fromisoformat(raw_activeFrom)

                print(document_id,document_name,document_description,activeFrom.strftime('%Y-%m-%d %H:%M:%S'))
                new_document_type=self.env['eta.document.types'].sudo().create({

                    'eta_id':document_id,
                    'name':document_name,
                    'description':document_description,
                    'activeFrom':activeFrom.strftime('%Y-%m-%d %H:%M:%S'),
                    'activeTo':activeTo.strftime('%Y-%m-%d %H:%M:%S') if activeTo!='' else '2021-12-10 05:50:20'

                })
                for document_version in document_type['documentTypeVersions']:
                    version_id=document_version['id']
                    version_typeName=document_version['typeName']
                    version_name=document_version['name']
                    version_description=document_version['description']
                    versionNumber=document_version['versionNumber']
                    status=document_version['status']
                    raw_version_activeFrom=str(document_version['activeFrom'])[:-1]
                    version_activeTo=''
                    if document_version['activeTo'] !=None:
                        raw_version_activeTo=str(document_version['activeTo'])[:-1]
                        version_activeTo = datetime.fromisoformat(raw_version_activeTo)
                    version_activeFrom=datetime.fromisoformat(raw_version_activeFrom)

                    print(version_id,version_typeName,version_name,version_description,versionNumber,status,version_activeFrom.strftime('%Y-%m-%d %H:%M:%S'))
                    self.env['eta.document.versions'].sudo().create({

                        'version_id':version_id,
                        'typeName':version_typeName,
                        'name':version_name,
                        'description':version_description,
                        'version_number':versionNumber,
                        'status':status,
                        'activeFrom':version_activeFrom.strftime('%Y-%m-%d %H:%M:%S'),
                        'activeTo':version_activeTo.strftime('%Y-%m-%d %H:%M:%S') if version_activeTo!='' else '2021-12-10 05:50:20',
                        'document_type':new_document_type.id,
                    })
            message_id = self.env['message.wizard'].create({'message': _("Got ETA Documents Types")})
            return {
                'name': _('Successfull'),
                'type': 'ir.actions.act_window',
                'view_mode': 'form',
                'res_model': 'message.wizard',
                # pass the id
                'res_id': message_id.id,
                'target': 'new'
            }
            #raise UserError(_("Got ETA Documents Types "))
        else:
            err=str(response.status_code) +' '+str(response.reason)
            #raise UserError(_(err))
            message_id = self.env['message.wizard'].create({'message': _(err)})
            return {
                'name': _('Successfull'),
                'type': 'ir.actions.act_window',
                'view_mode': 'form',
                'res_model': 'message.wizard',
                # pass the id
                'res_id': message_id.id,
                'target': 'new'
            }
        message_id = self.env['message.wizard'].create({'message': _(response.text)})
        return {
            'name': _('Successfull'),
            'type': 'ir.actions.act_window',
            'view_mode': 'form',
            'res_model': 'message.wizard',
            # pass the id
            'res_id': message_id.id,
            'target': 'new'
        }
        print(response.text)


class EtaDocumentTypes(models.Model):
    _name = "eta.document.types"
    _description = "ETA Documents Types for invoicing"


    eta_id=fields.Integer('Document Type ID')
    name=fields.Char("Name")
    description=fields.Char("Description")
    activeFrom=fields.Datetime("Active From",default=None)
    activeTo=fields.Datetime("Active To",default=None)



class EtaDocumentVersions(models.Model):
    _name = 'eta.document.versions'
    _description = "Eta Documents Versions"

    version_id=fields.Integer("Version Id")
    typeName=fields.Char("Type Name")
    name=fields.Char("Name")
    description=fields.Char("Description")
    version_number=fields.Char("Version Number")
    status=fields.Char("Status")
    activeFrom=fields.Datetime("Active From")
    activeTo=fields.Datetime("Active To")
    document_type=fields.Many2one('eta.document.types',"Document Type")


class ETAInvoice(models.Model):
    _inherit = "account.move"
    eta_api=fields.Many2one("eta.api","API Instance")
    document_type=fields.Many2one('eta.document.types',"Document Type")
    document_version=fields.Many2one('eta.document.versions',"Document Version")
    uuid=fields.Char("UUID ETA")
    submissionId=fields.Char("submissionId")
    hashKey=fields.Char("hashKey")
    longId=fields.Char("LongId ETA")
    internalId=fields.Char("InternalId ETA")
    def create_eta_invoice(self):
        company = self.env.user.company_id
        for record in self:
            url = "https://api.preprod.invoicing.eta.gov.eg/api/v1/documentsubmissions"
            invoiceDict = {}
            for invoiceLine in record.invoice_line_ids:
                # invoiceLine.product_id.description_sale
                # invoiceLine.product_id.default_code
                # record.company_id.currency_id.name
                invoiceDict.update({
                    "description": "sample desc",
                    "itemType": invoiceLine.product_id.categ_id.name,
                    "itemCode": "das1321",
                    "unitType": invoiceLine.product_id.uom_name,
                    "quantity": invoiceLine.quantity,
                    "internalCode": "das1321",
                    "salesTotal": invoiceLine.price_unit,
                    "total": record.amount_total,
                    "valueDifference": 0.00,
                    "totalTaxableFees": 0,
                    "netTotal": record.amount_total,
                    "itemsDiscount": 0,
                    "unitValue": {
                        "currencySold": "EGP",
                        "amountEGP": record.amount_total
                    },
                    "discount": {
                        "rate": 0,
                        "amount": 0
                    },
                    "taxableItems": [
                        {
                            "taxType": "T1",
                            "amount": 0,
                            "subType": "V001",
                            "rate": 0
                        }
                    ]
                })

            year = record.invoice_date.year
            day = record.invoice_date.day
            month = record.invoice_date.month
            data = {
                "documents":
                    [
                        {
                            "issuer": {
                                "address": {
                                    "branchID": record.company_id.vat,
                                    "country": record.partner_id.country_id.code,
                                    "governate": record.company_id.state_id.name,
                                    "regionCity": record.company_id.city,
                                    "street": record.company_id.street,
                                    "buildingNumber": record.company_id.street2,
                                    "postalCode": record.company_id.zip,
                                    "floor": record.company_id.street2,
                                    "room": record.company_id.street2,
                                    "landmark": record.company_id.street2,
                                    "additionalInformation": record.company_id.street2,

                                },
                                "type": "c",
                                "id": record.company_id.vat,
                                "name": record.company_id.name,
                            },
                            "receiver": {
                                "address": {
                                    "country": record.partner_id.country_id.code,
                                    "governate": record.partner_id.state_id.name,
                                    "regionCity": record.partner_id.city,
                                    "street": record.partner_id.street,
                                    "buildingNumber": record.partner_id.street2,
                                    "postalCode": record.partner_id.zip,
                                    "floor": record.partner_id.street2,
                                    "room": record.partner_id.street2,
                                    "landmark": record.partner_id.street2,
                                    "additionalInformation": record.partner_id.street2
                                },
                                "type": "c",
                                "id": record.partner_id.vat,
                                "name": record.partner_id.name
                            },
                            "documentType": record.document_type.name,
                            "documentTypeVersion": "0.9",
                            "dateTimeIssued": "{}-0{}-0{}T10:30:10Z".format(year, month, day),
                            "taxpayerActivityCode": "4620",
                            "internalID": record.payment_reference,
                            "purchaseOrderReference": str(record.ref) + "Purchase",
                            "purchaseOrderDescription": "some sss",
                            "salesOrderReference": str(record.ref) + "Sale",
                            "salesOrderDescription": "some sss",
                            "proformaInvoiceNumber": str(record.ref) + "proforma",
                            "payment": {
                                "bankName": "Sample Bank",
                                "bankAddress": "Sample Bank Address",
                                "bankAccountNo": "122225336654",
                                "bankAccountIBAN": "PKNMCKD123213200321",
                                "swiftCode": "1232",
                                "terms": "immedate payment"
                            },
                            "delivery": {
                                "approach": "SomeValue",
                                "packaging": "SomeValue",
                                "dateValidity": "{}-0{}-0{}T10:30:10Z".format(year, month, day),
                                "exportPort": "SomeValue",
                                "grossWeight": 10.50,
                                "netWeight": 20.50,
                                "terms": "SomeValue"
                            },
                            "invoiceLines": [invoiceDict],
                            "totalDiscountAmount": 0,
                            "totalSalesAmount": record.amount_total,
                            "netAmount": record.amount_total,
                            "taxTotals": [
                                {
                                    "taxType": "T1",
                                    "amount": 0
                                }
                            ],
                            "totalAmount": record.amount_total,
                            "extraDiscountAmount": 0,
                            "totalItemsDiscountAmount": 0,
                            "signatures": [
                                {
                                    "signatureType": "I",
                                    "value": company.signature_str
                                }
                            ]

                        }
                    ]
            }
            # payload = "{\r\n    \"documents\": [\r\n        {\r\n            \"issuer\": {\r\n                \"address\": {\r\n                    \"branchID\": \"0\",\r\n                    \"country\": \"EG\",\r\n                    \"governate\": \"Cairo\",\r\n                    \"regionCity\": \"Nasr City\",\r\n                    \"street\": \"580 Clementina Key\",\r\n                    \"buildingNumber\": \"Bldg. 0\",\r\n                    \"postalCode\": \"68030\",\r\n                    \"floor\": \"1\",\r\n                    \"room\": \"123\",\r\n                    \"landmark\": \"7660 Melody Trail\",\r\n                    \"additionalInformation\": \"beside Townhall\"\r\n                },\r\n                \"type\": \"B\",\r\n                \"id\": \"476925703\",\r\n                \"name\": \"ابس فالي للبرمجات\"\r\n            },\r\n            \"receiver\": {\r\n                \"address\": {\r\n                    \"country\": \"EG\",\r\n                    \"governate\": \"Egypt\",\r\n                    \"regionCity\": \"Mufazat al Ismlyah\",\r\n                    \"street\": \"580 Clementina Key\",\r\n                    \"buildingNumber\": \"Bldg. 0\",\r\n                    \"postalCode\": \"68030\",\r\n                    \"floor\": \"1\",\r\n                    \"room\": \"123\",\r\n                    \"landmark\": \"7660 Melody Trail\",\r\n                    \"additionalInformation\": \"beside Townhall\"\r\n                },\r\n                \"type\": \"B\",\r\n                \"id\": \"313717919\",\r\n                \"name\": \"Receiver\"\r\n            },\r\n            \"documentType\": \"I\",\r\n            \"documentTypeVersion\": \"0.9\",\r\n            \"dateTimeIssued\": \"2021-04-01T10:30:10Z\",\r\n            \"taxpayerActivityCode\": \"4620\",\r\n            \"internalID\": \"IID1\",\r\n            \"purchaseOrderReference\": \"P-233-A6375\",\r\n            \"purchaseOrderDescription\": \"purchase Order description\",\r\n            \"salesOrderReference\": \"1231\",\r\n            \"salesOrderDescription\": \"Sales Order description\",\r\n            \"proformaInvoiceNumber\": \"SomeValue\",\r\n            \"payment\": {\r\n                \"bankName\": \"SomeValue\",\r\n                \"bankAddress\": \"SomeValue\",\r\n                \"bankAccountNo\": \"SomeValue\",\r\n                \"bankAccountIBAN\": \"\",\r\n                \"swiftCode\": \"\",\r\n                \"terms\": \"SomeValue\"\r\n            },\r\n            \"delivery\": {\r\n                \"approach\": \"SomeValue\",\r\n                \"packaging\": \"SomeValue\",\r\n                \"dateValidity\": \"2021-04-05T13:30:10Z\",\r\n                \"exportPort\": \"SomeValue\",\r\n                \"grossWeight\": 10.50,\r\n                \"netWeight\": 20.50,\r\n                \"terms\": \"SomeValue\"\r\n            },\r\n            \"invoiceLines\": [\r\n                {\r\n                    \"description\": \"Computer1\",\r\n                    \"itemType\": \"EGS\",\r\n                    \"itemCode\": \"EG-113317713-123456\",\r\n                    \"unitType\": \"EA\",\r\n                    \"quantity\": 1,\r\n                    \"internalCode\": \"IC0\",\r\n                    \"salesTotal\": 111111111111.00,\r\n                    \"total\": 111111111111.00,\r\n                    \"valueDifference\": 0.00,\r\n                    \"totalTaxableFees\": 0,\r\n                    \"netTotal\": 111111111111,\r\n                    \"itemsDiscount\": 0,\r\n                    \"unitValue\": {\r\n                        \"currencySold\": \"EGP\",\r\n                        \"amountEGP\": 111111111111.00\r\n                    },\r\n                    \"discount\": {\r\n                        \"rate\": 0,\r\n                        \"amount\": 0\r\n                    },\r\n                    \"taxableItems\": [\r\n                        {\r\n                            \"taxType\": \"T1\",\r\n                            \"amount\": 0,\r\n                            \"subType\": \"V001\",\r\n                            \"rate\": 0\r\n                        }\r\n                    ]\r\n                },\r\n                {\r\n                    \"description\": \"Computer1\",\r\n                    \"itemType\": \"EGS\",\r\n                    \"itemCode\": \"EG-113317713-123456\",\r\n                    \"unitType\": \"EA\",\r\n                    \"quantity\": 1,\r\n                    \"internalCode\": \"IC0\",\r\n                    \"salesTotal\": 111111111111.00,\r\n                    \"total\": 111111111111.00,\r\n                    \"valueDifference\": 0.00,\r\n                    \"totalTaxableFees\": 0,\r\n                    \"netTotal\": 111111111111,\r\n                    \"itemsDiscount\": 0,\r\n                    \"unitValue\": {\r\n                        \"currencySold\": \"EGP\",\r\n                        \"amountEGP\": 111111111111.00\r\n                    },\r\n                    \"discount\": {\r\n                        \"rate\": 0,\r\n                        \"amount\": 0\r\n                    },\r\n                    \"taxableItems\": [\r\n                        {\r\n                            \"taxType\": \"T1\",\r\n                            \"amount\": 0,\r\n                            \"subType\": \"V001\",\r\n                            \"rate\": 0\r\n                        }\r\n                    ]\r\n                },\r\n                {\r\n                    \"description\": \"Computer1\",\r\n                    \"itemType\": \"EGS\",\r\n                    \"itemCode\": \"EG-113317713-123456\",\r\n                    \"unitType\": \"EA\",\r\n                    \"quantity\": 1,\r\n                    \"internalCode\": \"IC0\",\r\n                    \"salesTotal\": 111111111111.00,\r\n                    \"total\": 111111111111.00,\r\n                    \"valueDifference\": 0.00,\r\n                    \"totalTaxableFees\": 0,\r\n                    \"netTotal\": 111111111111,\r\n                    \"itemsDiscount\": 0,\r\n                    \"unitValue\": {\r\n                        \"currencySold\": \"EGP\",\r\n                        \"amountEGP\": 111111111111.00\r\n                    },\r\n                    \"discount\": {\r\n                        \"rate\": 0,\r\n                        \"amount\": 0\r\n                    },\r\n                    \"taxableItems\": [\r\n                        {\r\n                            \"taxType\": \"T1\",\r\n                            \"amount\": 0,\r\n                            \"subType\": \"V001\",\r\n                            \"rate\": 0\r\n                        }\r\n                    ]\r\n                },\r\n                {\r\n                    \"description\": \"Computer1\",\r\n                    \"itemType\": \"EGS\",\r\n                    \"itemCode\": \"EG-113317713-123456\",\r\n                    \"unitType\": \"EA\",\r\n                    \"quantity\": 1,\r\n                    \"internalCode\": \"IC0\",\r\n                    \"salesTotal\": 111111111111.00,\r\n                    \"total\": 111111111111.00,\r\n                    \"valueDifference\": 0.00,\r\n                    \"totalTaxableFees\": 0,\r\n                    \"netTotal\": 111111111111,\r\n                    \"itemsDiscount\": 0,\r\n                    \"unitValue\": {\r\n                        \"currencySold\": \"EGP\",\r\n                        \"amountEGP\": 111111111111.00\r\n                    },\r\n                    \"discount\": {\r\n                        \"rate\": 0,\r\n                        \"amount\": 0\r\n                    },\r\n                    \"taxableItems\": [\r\n                        {\r\n                            \"taxType\": \"T1\",\r\n                            \"amount\": 0,\r\n                            \"subType\": \"V001\",\r\n                            \"rate\": 0\r\n                        }\r\n                    ]\r\n                },\r\n                {\r\n                    \"description\": \"Computer1\",\r\n                    \"itemType\": \"EGS\",\r\n                    \"itemCode\": \"EG-113317713-123456\",\r\n                    \"unitType\": \"EA\",\r\n                    \"quantity\": 1,\r\n                    \"internalCode\": \"IC0\",\r\n                    \"salesTotal\": 111111111111.00,\r\n                    \"total\": 111111111111.00,\r\n                    \"valueDifference\": 0.00,\r\n                    \"totalTaxableFees\": 0,\r\n                    \"netTotal\": 111111111111,\r\n                    \"itemsDiscount\": 0,\r\n                    \"unitValue\": {\r\n                        \"currencySold\": \"EGP\",\r\n                        \"amountEGP\": 111111111111.00\r\n                    },\r\n                    \"discount\": {\r\n                        \"rate\": 0,\r\n                        \"amount\": 0\r\n                    },\r\n                    \"taxableItems\": [\r\n                        {\r\n                            \"taxType\": \"T1\",\r\n                            \"amount\": 0,\r\n                            \"subType\": \"V001\",\r\n                            \"rate\": 0\r\n                        }\r\n                    ]\r\n                }\r\n            ],\r\n            \"totalDiscountAmount\": 0,\r\n            \"totalSalesAmount\": 555555555555.00,\r\n            \"netAmount\": 555555555555.00,\r\n            \"taxTotals\": [\r\n                {\r\n                    \"taxType\": \"T1\",\r\n                    \"amount\": 0\r\n                }\r\n            ],\r\n            \"totalAmount\": 555555555555.00,\r\n            \"extraDiscountAmount\": 0,\r\n            \"totalItemsDiscountAmount\": 0\r\n            \r\n        }\r\n    ]\r\n}"
            eta_api_model = record.env['eta.api'].search([("id", "=", record.eta_api.id)])
            access_token = str(eta_api_model.access_token)
            headers = {
                'Accept-Language': 'ar',
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': "Bearer " + access_token,
                # "correlationId":"0HM7I1O32PSED:00000001"
            }
            try:
                response = requests.request("POST", url, data=json.dumps(data), headers=headers, verify=False)
                if response.status_code == 202:
                    invoice_res = json.loads(response.text)
                    record.hashKey = invoice_res['acceptedDocuments'][0]['hashKey']
                    record.submissionId = invoice_res['submissionId']
                    record.uuid = invoice_res['acceptedDocuments'][0]['uuid']
                    record.internalId = invoice_res['acceptedDocuments'][0]['internalId']
                    record.longId = invoice_res['acceptedDocuments'][0]['longId']
                    record.env['account.move'].sudo().write({
                        "hashKey": record.hashKey,
                        "submissionId": record.submissionId,
                        "uuid": record.uuid,
                        "internalId": record.internalId,
                        "longId": record.longId,
                    })
                    print(response.status_code, response.text)
                    message_id = record.env['message.wizard'].create({'message': _(response.text)})
                    return {
                        'name': _('Successfull'),
                        'type': 'ir.actions.act_window',
                        'view_mode': 'form',
                        'res_model': 'message.wizard',
                        # pass the id
                        'res_id': message_id.id,
                        'target': 'new'
                    }
                # raise UserError(response.status_code)
            except Exception as ex:
                message_id = record.env['message.wizard'].create({'message': _(ex)})
                return {
                    'name': _('Successfull'),
                    'type': 'ir.actions.act_window',
                    'view_mode': 'form',
                    'res_model': 'message.wizard',
                    # pass the id
                    'res_id': message_id.id,
                    'target': 'new'
                }
                # raise UserError(ex)
            
    def create_eta_invoice_credit(self):
        url = "https://api.preprod.invoicing.eta.gov.eg/api/v1/documentsubmissions"
        invoiceDict = {}
        for invoiceLine in self.invoice_line_ids:
            # invoiceLine.product_id.description_sale
            # invoiceLine.product_id.default_code
            # self.company_id.currency_id.name
            invoiceDict.update({
                "description": "sample desc",
                "itemType": invoiceLine.product_id.categ_id.name,
                "itemCode": "das1321",
                "unitType": invoiceLine.product_id.uom_name,
                "quantity": invoiceLine.quantity,
                "internalCode": "das1321",
                "salesTotal": invoiceLine.price_unit,
                "total": self.amount_total,
                "valueDifference": 0.00,
                "totalTaxableFees": 0,
                "netTotal": self.amount_total,
                "itemsDiscount": 0,
                "unitValue": {
                    "currencySold": "EGP",
                    "amountEGP": self.amount_total
                },
                "discount": {
                    "rate": 0,
                    "amount": 0
                },
                "taxableItems": [
                    {
                        "taxType": "T1",
                        "amount": 0,
                        "subType": "V001",
                        "rate": 0
                    }
                ]
            })

        year = self.invoice_date.year
        day = self.invoice_date.day
        month = self.invoice_date.month
        data = {
            "documents":
                [
                    {
                        "issuer": {
                            "address": {
                                "branchID": self.company_id.vat,
                                "country": self.partner_id.country_id.code,
                                "governate": self.company_id.state_id.name,
                                "regionCity": self.company_id.city,
                                "street": self.company_id.street,
                                "buildingNumber": self.company_id.street2,
                                "postalCode": self.company_id.zip,
                                "floor": self.company_id.street2,
                                "room": self.company_id.street2,
                                "landmark": self.company_id.street2,
                                "additionalInformation": self.company_id.street2,

                            },
                            "type": "B",
                            "id": self.company_id.vat,
                            "name": self.company_id.name,
                        },
                        "receiver": {
                            "address": {
                                "country": self.partner_id.country_id.code,
                                "governate": self.partner_id.state_id.name,
                                "regionCity": self.partner_id.city,
                                "street": self.partner_id.street,
                                "buildingNumber": self.partner_id.street2,
                                "postalCode": self.partner_id.zip,
                                "floor": self.partner_id.street2,
                                "room": self.partner_id.street2,
                                "landmark": self.partner_id.street2,
                                "additionalInformation": self.partner_id.street2
                            },
                            "type": "B",
                            "id": self.partner_id.vat,
                            "name": self.partner_id.name
                        },
                        "documentType": self.document_type.name,
                        "documentTypeVersion": "0.9",
                        "dateTimeIssued": "{}-0{}-0{}T10:30:10Z".format(year, month, day),
                        "taxpayerActivityCode": "4620",
                        "internalID": self.payment_reference,
                        "purchaseOrderReference": str(self.ref) + "Purchase",
                        "purchaseOrderDescription": "some sss",
                        "salesOrderReference": str(self.ref) + "Sale",
                        "salesOrderDescription": "some sss",
                        "proformaInvoiceNumber": str(self.ref) + "proforma",
                        "payment": {
                            "bankName": "Sample Bank",
                            "bankAddress": "Sample Bank Address",
                            "bankAccountNo": "122225336654",
                            "bankAccountIBAN": "PKNMCKD123213200321",
                            "swiftCode": "1232",
                            "terms": "immedate payment"
                        },
                        "delivery": {
                            "approach": "SomeValue",
                            "packaging": "SomeValue",
                            "dateValidity": "{}-0{}-0{}T10:30:10Z".format(year, month, day),
                            "exportPort": "SomeValue",
                            "grossWeight": 10.50,
                            "netWeight": 20.50,
                            "terms": "SomeValue"
                        },
                        "invoiceLines": [invoiceDict],
                        "totalDiscountAmount": 0,
                        "totalSalesAmount": self.amount_total,
                        "netAmount": self.amount_total,
                        "taxTotals": [
                            {
                                "taxType": "T1",
                                "amount": 0
                            }
                        ],
                        "totalAmount": self.amount_total,
                        "extraDiscountAmount": 0,
                        "totalItemsDiscountAmount": 0

                    }
                ]
        }
        # payload = "{\r\n    \"documents\": [\r\n        {\r\n            \"issuer\": {\r\n                \"address\": {\r\n                    \"branchID\": \"0\",\r\n                    \"country\": \"EG\",\r\n                    \"governate\": \"Cairo\",\r\n                    \"regionCity\": \"Nasr City\",\r\n                    \"street\": \"580 Clementina Key\",\r\n                    \"buildingNumber\": \"Bldg. 0\",\r\n                    \"postalCode\": \"68030\",\r\n                    \"floor\": \"1\",\r\n                    \"room\": \"123\",\r\n                    \"landmark\": \"7660 Melody Trail\",\r\n                    \"additionalInformation\": \"beside Townhall\"\r\n                },\r\n                \"type\": \"B\",\r\n                \"id\": \"476925703\",\r\n                \"name\": \"ابس فالي للبرمجات\"\r\n            },\r\n            \"receiver\": {\r\n                \"address\": {\r\n                    \"country\": \"EG\",\r\n                    \"governate\": \"Egypt\",\r\n                    \"regionCity\": \"Mufazat al Ismlyah\",\r\n                    \"street\": \"580 Clementina Key\",\r\n                    \"buildingNumber\": \"Bldg. 0\",\r\n                    \"postalCode\": \"68030\",\r\n                    \"floor\": \"1\",\r\n                    \"room\": \"123\",\r\n                    \"landmark\": \"7660 Melody Trail\",\r\n                    \"additionalInformation\": \"beside Townhall\"\r\n                },\r\n                \"type\": \"B\",\r\n                \"id\": \"313717919\",\r\n                \"name\": \"Receiver\"\r\n            },\r\n            \"documentType\": \"I\",\r\n            \"documentTypeVersion\": \"0.9\",\r\n            \"dateTimeIssued\": \"2021-04-01T10:30:10Z\",\r\n            \"taxpayerActivityCode\": \"4620\",\r\n            \"internalID\": \"IID1\",\r\n            \"purchaseOrderReference\": \"P-233-A6375\",\r\n            \"purchaseOrderDescription\": \"purchase Order description\",\r\n            \"salesOrderReference\": \"1231\",\r\n            \"salesOrderDescription\": \"Sales Order description\",\r\n            \"proformaInvoiceNumber\": \"SomeValue\",\r\n            \"payment\": {\r\n                \"bankName\": \"SomeValue\",\r\n                \"bankAddress\": \"SomeValue\",\r\n                \"bankAccountNo\": \"SomeValue\",\r\n                \"bankAccountIBAN\": \"\",\r\n                \"swiftCode\": \"\",\r\n                \"terms\": \"SomeValue\"\r\n            },\r\n            \"delivery\": {\r\n                \"approach\": \"SomeValue\",\r\n                \"packaging\": \"SomeValue\",\r\n                \"dateValidity\": \"2021-04-05T13:30:10Z\",\r\n                \"exportPort\": \"SomeValue\",\r\n                \"grossWeight\": 10.50,\r\n                \"netWeight\": 20.50,\r\n                \"terms\": \"SomeValue\"\r\n            },\r\n            \"invoiceLines\": [\r\n                {\r\n                    \"description\": \"Computer1\",\r\n                    \"itemType\": \"EGS\",\r\n                    \"itemCode\": \"EG-113317713-123456\",\r\n                    \"unitType\": \"EA\",\r\n                    \"quantity\": 1,\r\n                    \"internalCode\": \"IC0\",\r\n                    \"salesTotal\": 111111111111.00,\r\n                    \"total\": 111111111111.00,\r\n                    \"valueDifference\": 0.00,\r\n                    \"totalTaxableFees\": 0,\r\n                    \"netTotal\": 111111111111,\r\n                    \"itemsDiscount\": 0,\r\n                    \"unitValue\": {\r\n                        \"currencySold\": \"EGP\",\r\n                        \"amountEGP\": 111111111111.00\r\n                    },\r\n                    \"discount\": {\r\n                        \"rate\": 0,\r\n                        \"amount\": 0\r\n                    },\r\n                    \"taxableItems\": [\r\n                        {\r\n                            \"taxType\": \"T1\",\r\n                            \"amount\": 0,\r\n                            \"subType\": \"V001\",\r\n                            \"rate\": 0\r\n                        }\r\n                    ]\r\n                },\r\n                {\r\n                    \"description\": \"Computer1\",\r\n                    \"itemType\": \"EGS\",\r\n                    \"itemCode\": \"EG-113317713-123456\",\r\n                    \"unitType\": \"EA\",\r\n                    \"quantity\": 1,\r\n                    \"internalCode\": \"IC0\",\r\n                    \"salesTotal\": 111111111111.00,\r\n                    \"total\": 111111111111.00,\r\n                    \"valueDifference\": 0.00,\r\n                    \"totalTaxableFees\": 0,\r\n                    \"netTotal\": 111111111111,\r\n                    \"itemsDiscount\": 0,\r\n                    \"unitValue\": {\r\n                        \"currencySold\": \"EGP\",\r\n                        \"amountEGP\": 111111111111.00\r\n                    },\r\n                    \"discount\": {\r\n                        \"rate\": 0,\r\n                        \"amount\": 0\r\n                    },\r\n                    \"taxableItems\": [\r\n                        {\r\n                            \"taxType\": \"T1\",\r\n                            \"amount\": 0,\r\n                            \"subType\": \"V001\",\r\n                            \"rate\": 0\r\n                        }\r\n                    ]\r\n                },\r\n                {\r\n                    \"description\": \"Computer1\",\r\n                    \"itemType\": \"EGS\",\r\n                    \"itemCode\": \"EG-113317713-123456\",\r\n                    \"unitType\": \"EA\",\r\n                    \"quantity\": 1,\r\n                    \"internalCode\": \"IC0\",\r\n                    \"salesTotal\": 111111111111.00,\r\n                    \"total\": 111111111111.00,\r\n                    \"valueDifference\": 0.00,\r\n                    \"totalTaxableFees\": 0,\r\n                    \"netTotal\": 111111111111,\r\n                    \"itemsDiscount\": 0,\r\n                    \"unitValue\": {\r\n                        \"currencySold\": \"EGP\",\r\n                        \"amountEGP\": 111111111111.00\r\n                    },\r\n                    \"discount\": {\r\n                        \"rate\": 0,\r\n                        \"amount\": 0\r\n                    },\r\n                    \"taxableItems\": [\r\n                        {\r\n                            \"taxType\": \"T1\",\r\n                            \"amount\": 0,\r\n                            \"subType\": \"V001\",\r\n                            \"rate\": 0\r\n                        }\r\n                    ]\r\n                },\r\n                {\r\n                    \"description\": \"Computer1\",\r\n                    \"itemType\": \"EGS\",\r\n                    \"itemCode\": \"EG-113317713-123456\",\r\n                    \"unitType\": \"EA\",\r\n                    \"quantity\": 1,\r\n                    \"internalCode\": \"IC0\",\r\n                    \"salesTotal\": 111111111111.00,\r\n                    \"total\": 111111111111.00,\r\n                    \"valueDifference\": 0.00,\r\n                    \"totalTaxableFees\": 0,\r\n                    \"netTotal\": 111111111111,\r\n                    \"itemsDiscount\": 0,\r\n                    \"unitValue\": {\r\n                        \"currencySold\": \"EGP\",\r\n                        \"amountEGP\": 111111111111.00\r\n                    },\r\n                    \"discount\": {\r\n                        \"rate\": 0,\r\n                        \"amount\": 0\r\n                    },\r\n                    \"taxableItems\": [\r\n                        {\r\n                            \"taxType\": \"T1\",\r\n                            \"amount\": 0,\r\n                            \"subType\": \"V001\",\r\n                            \"rate\": 0\r\n                        }\r\n                    ]\r\n                },\r\n                {\r\n                    \"description\": \"Computer1\",\r\n                    \"itemType\": \"EGS\",\r\n                    \"itemCode\": \"EG-113317713-123456\",\r\n                    \"unitType\": \"EA\",\r\n                    \"quantity\": 1,\r\n                    \"internalCode\": \"IC0\",\r\n                    \"salesTotal\": 111111111111.00,\r\n                    \"total\": 111111111111.00,\r\n                    \"valueDifference\": 0.00,\r\n                    \"totalTaxableFees\": 0,\r\n                    \"netTotal\": 111111111111,\r\n                    \"itemsDiscount\": 0,\r\n                    \"unitValue\": {\r\n                        \"currencySold\": \"EGP\",\r\n                        \"amountEGP\": 111111111111.00\r\n                    },\r\n                    \"discount\": {\r\n                        \"rate\": 0,\r\n                        \"amount\": 0\r\n                    },\r\n                    \"taxableItems\": [\r\n                        {\r\n                            \"taxType\": \"T1\",\r\n                            \"amount\": 0,\r\n                            \"subType\": \"V001\",\r\n                            \"rate\": 0\r\n                        }\r\n                    ]\r\n                }\r\n            ],\r\n            \"totalDiscountAmount\": 0,\r\n            \"totalSalesAmount\": 555555555555.00,\r\n            \"netAmount\": 555555555555.00,\r\n            \"taxTotals\": [\r\n                {\r\n                    \"taxType\": \"T1\",\r\n                    \"amount\": 0\r\n                }\r\n            ],\r\n            \"totalAmount\": 555555555555.00,\r\n            \"extraDiscountAmount\": 0,\r\n            \"totalItemsDiscountAmount\": 0\r\n            \r\n        }\r\n    ]\r\n}"
        eta_api_model = self.env['eta.api'].search([("id", "=", self.eta_api.id)])
        access_token = str(eta_api_model.access_token)
        headers = {
            'Accept-Language': 'ar',
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + access_token,
            # "correlationId":"0HM7I1O32PSED:00000001"
        }
        try:
            response = requests.request("POST", url, data=json.dumps(data), headers=headers, verify=False)
            if response.status_code == 202:
                invoice_res = json.loads(response.text)
                self.hashKey = invoice_res['acceptedDocuments'][0]['hashKey']
                self.submissionId = invoice_res['submissionId']
                self.uuid = invoice_res['acceptedDocuments'][0]['uuid']
                self.internalId = invoice_res['acceptedDocuments'][0]['internalId']
                self.longId = invoice_res['acceptedDocuments'][0]['longId']
                self.env['account.move'].sudo().write({
                    "hashKey": self.hashKey,
                    "submissionId": self.submissionId,
                    "uuid": self.uuid,
                    "internalId": self.internalId,
                    "longId": self.longId,
                })
                print(response.status_code, response.text)
                message_id = self.env['message.wizard'].create({'message': _(response.text)})
                return {
                    'name': _('Successfull'),
                    'type': 'ir.actions.act_window',
                    'view_mode': 'form',
                    'res_model': 'message.wizard',
                    # pass the id
                    'res_id': message_id.id,
                    'target': 'new'
                }
            # raise UserError(response.status_code)
        except Exception as ex:
            message_id = self.env['message.wizard'].create({'message': _(ex)})
            return {
                'name': _('Successfull'),
                'type': 'ir.actions.act_window',
                'view_mode': 'form',
                'res_model': 'message.wizard',
                # pass the id
                'res_id': message_id.id,
                'target': 'new'
            }
            # raise UserError(ex)

