export function checkAuth(req, res, next) {
  const isAuth = req.session && req.session.user; // или другой способ проверки
  
  if (isAuth) {
    return next();
  } else {
    // Проверка пути
    if (req.path.startsWith('/api/')) {
      // API-запрос — возвращаем JSON
      return res.status(401).json({
        status: 401,
        data: 'Не авторизован'
        });
    } else {
      // Не API — редирект на страницу входа
      res.redirect('/login');
    }
  }
}