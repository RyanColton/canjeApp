SELECT EXISTS(SELECT 1 FROM offers WHERE userofferedtoid=$1 AND seen=FALSE)
