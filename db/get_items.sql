SELECT i.*, u.* FROM items i
JOIN users u ON i.userid=u.userid
WHERE i.available = true
ORDER BY i.itemid DESC
LIMIT 50
