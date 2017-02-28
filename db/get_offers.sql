SELECT o.*, u.*, oi.itemname AS offeritemname, oi.itemimageurl AS offeritemimage, oi.itemcatagory AS offeritemcatagory, wi.itemname AS wanteditemname, wi.itemimageurl AS wanteditemimage, wi.itemcatagory AS wanteditemcatagory FROM offers o
JOIN users u ON u.userid=o.userofferingid
JOIN items oi ON o.itemofferedid=oi.itemid
JOIN items wi ON o.itemwantedid=wi.itemid
WHERE o.userofferedtoid = $1
ORDER BY o.datestamp ASC
