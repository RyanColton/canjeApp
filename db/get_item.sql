Select i.*, u.* FROM items i
JOIN users u ON i.userid=u.userid
WHERE itemid = $1
