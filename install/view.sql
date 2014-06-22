CREATE OR REPLACE VIEW cdrview AS
	SELECT *,
		CASE
			WHEN LENGTH(src) > 5 THEN 'in'
			WHEN LENGTH(src) < 5 AND length(dst) < 5 THEN 'int'
			ELSE 'out'
		END AS direction
	FROM cdr;
