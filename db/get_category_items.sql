SELECT i.*, u.* FROM items i
JOIN users u ON i.userid=u.userid
WHERE i.available = true AND i.itemcatagory = $1
ORDER BY i.itemid DESC
