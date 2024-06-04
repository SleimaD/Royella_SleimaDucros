# from django.http import HttpResponseForbidden

# class RoleBasedMiddleware:
#     def __init__(self, get_response, roles):
#         self.get_response = get_response
#         self.allowed_roles = roles

#     def __call__(self, request):
#         response = self.get_response(request)
#         return response

#     def process_view(self, request, view_func, view_args, view_kwargs):
#         if not request.user.is_authenticated:
#             return HttpResponseForbidden("Authentication required")
#         if hasattr(view_func, 'role_required'):
#             role_required = view_func.role_required
#             if not request.user.role in role_required:
#                 return HttpResponseForbidden("You do not have permission to perform this action")
#         return None

# def role_required(*roles):
#     def decorator(func):
#         func.role_required = roles
#         return func
#     return decorator

# # Middleware factory function
# def RoleBasedMiddlewareFactory(roles):
#     def middleware(get_response):
#         return RoleBasedMiddleware(get_response, roles)
#     return middleware
