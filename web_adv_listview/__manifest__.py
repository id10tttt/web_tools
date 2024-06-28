# -*- coding: utf-8 -*-
##############################################################################
# 
# Odoo Proprietary License v1.0
# 
# This software and associated files (the "Software") may only be used (executed)
#  if you have purchased a valid license from the authors, typically via Odoo 
#  Apps, or if you have received a written agreement from the authors of the 
#  Software (see the COPYRIGHT file). 
# 
# You may develop Odoo modules that use the Software as a library (typically 
#  by depending on it, importing it and using its resources), but without 
# copying any source code or material from the Software. 
# You may distribute those modules under the license of your choice, provided 
# that this license is compatible with the terms of the Odoo Proprietary License 
# (For example: LGPL, MIT, or proprietary licenses similar to this one). 
# 
# It is forbidden to modify, upgrade, publish, distribute, sublicense, or sell 
# copies of the Software or modified copies of the Software. 
# 
# The above copyright notice and this permission notice must be included in all 
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
# IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
# DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
# ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.
# 
###############################################################################

{
    'name': 'Web Advanced Dynamic List',
    'author': '1di0t',
    'category': 'ListView',
    'summary': 'Advanced/Dynamic List View',
    'description': """
    1. You can dynamic set columns by yourself in tree view. 
    2. You can search the fields name and drag the fields. 
    3. Custom filter can search fields.
    """,
    'images': [
        'images/dynamic_list_view.png'
    ],
    'depends': ['web'],
    'data': [
    ],
    'price': 0.99,
    'currency': 'USD',
    'support': 'dgqcjx@gmail.com',
    "assets": {
        'web.assets_qweb': [
            'web_adv_listview/static/src/xml/listview_button_view.xml',
            'web_adv_listview/static/src/xml/custom_filter_item.xml',
        ],
        'web.assets_backend': [
            'web_adv_listview/static/src/lib/bootstrap-select/bootstrap-select.min.css',
            'web_adv_listview/static/src/lib/bootstrap-select/bootstrap-select.min.js',
            'web_adv_listview/static/src/js/*.js',
            'web_adv_listview/static/src/scss/dynamic_list.scss',
            'web_adv_listview/static/src/scss/custom_filter_item.scss',
        ],
    },
    'demo': [],
    'test': [
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'Other proprietary'
}
