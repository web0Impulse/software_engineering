export function checkAuth(req, res, next) {
  const isAuth = req.session && req.session.user;
  // const publicPaths = ['/login', '/api/login', '/signup', '/api/signup']; // публичные страницы без авторизации
  const publicPaths = ['/login', '/signup'];
  const publicApiPaths = ['/api/login', '/api/signup'];

  // Если пользователь авторизован и заходит на страницу входа или регистрации — перенаправляем на главную
  if (isAuth && publicPaths.includes(req.path)) {
    return res.redirect('/');
  }

  // Если пользователь не авторизован и заходит не на публичные страницы — перенаправляем на /login
  if (!isAuth) {
    if (req.path == '/') {
      return res.redirect('/login');
    } else if (!publicPaths.includes(req.path) && !publicApiPaths.includes(req.path)) {
      // Иначе
      // TODO добавить обработку чтобы пропускало на несуществующие страницы
      return res.status(403).json({
        data: "Unauthorized"
      });
    }    
  }

  // Во всех остальных случаях — разрешаем доступ
  next();
}