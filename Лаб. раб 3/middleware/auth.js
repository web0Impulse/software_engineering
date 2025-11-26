export function checkAuth(req, res, next) {
  const isAuth = req.session && req.session.user;
  const publicPaths = ['/login', '/api/login', '/signup', '/api/signup']; // публичные страницы без авторизации

  // Если пользователь авторизован и заходит на страницу входа или регистрации — перенаправляем на главную
  if (isAuth && publicPaths.includes(req.path)) {
    return res.redirect('/');
  }

  // Если пользователь не авторизован и заходит не на публичные страницы — перенаправляем на /login
  if (!isAuth && !publicPaths.includes(req.path)) {
    return res.redirect('/login');
  }

  // Во всех остальных случаях — разрешаем доступ
  next();
}