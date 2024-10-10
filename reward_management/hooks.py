app_name = "reward_management"
app_title = "Reward Management"
app_publisher = "Palak Padalia"
app_description = "Reward Management"
app_email = "palak@sanskartechnolab.com"
app_license = "mit"
# required_apps = []

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/reward_management/css/reward_management.css"
# app_include_js = "/assets/reward_management/js/reward_management.js"

# include js, css files in header of web template
# web_include_css = "/assets/reward_management/css/reward_management.css"
# web_include_js = "/assets/reward_management/js/reward_management.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "reward_management/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "reward_management/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "reward_management.utils.jinja_methods",
# 	"filters": "reward_management.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "reward_management.install.before_install"
# after_install = "reward_management.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "reward_management.uninstall.before_uninstall"
# after_uninstall = "reward_management.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "reward_management.utils.before_app_install"
# after_app_install = "reward_management.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "reward_management.utils.before_app_uninstall"
# after_app_uninstall = "reward_management.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "reward_management.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }
doc_events = {
    "User": {
         "after_insert": "reward_management.api.admin_notifications.send_system_notification"
    },
   "Redeem Request": {
        "on_update": "reward_management.api.admin_notifications.send_customer_reward_approved_notification",
    }
}


# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"reward_management.tasks.all"
# 	],
# 	"daily": [
# 		"reward_management.tasks.daily"
# 	],
# 	"hourly": [
# 		"reward_management.tasks.hourly"
# 	],
# 	"weekly": [
# 		"reward_management.tasks.weekly"
# 	],
# 	"monthly": [
# 		"reward_management.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "reward_management.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "reward_management.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "reward_management.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["reward_management.utils.before_request"]
# after_request = ["reward_management.utils.after_request"]

# Job Events
# ----------
# before_job = ["reward_management.utils.before_job"]
# after_job = ["reward_management.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"reward_management.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }


website_route_rules = [{'from_route': '/rewards/<path:app_path>', 'to_route': 'rewards'},]

fixtures = [

     {
        "dt": "Role",     
    },
     {
        "dt": "Custom DocPerm",
    },
     {
         "dt":"Role Profile",
     },
         {
         "dt":"Website Settings",
     }

]
