SELECT i.*, u.* FROM items i
JOIN users u ON i.userid=u.userid
WHERE i.available = true
ORDER BY i.datestamp DESC
LIMIT 100
