DROP FUNCTION IF EXISTS generate_sales_report(timestamp with time zone, timestamp with time zone);

CREATE OR REPLACE FUNCTION generate_sales_report(start_date TIMESTAMPTZ, end_date TIMESTAMPTZ) 
RETURNS TABLE (
    product_name TEXT,
    total_quantity INT,
    total_amount FLOAT,
    percentage FLOAT
) 
AS $$
BEGIN
    RETURN QUERY
    WITH total_sales AS (
        SELECT 
            SUM(si.quantity * p.price) AS total_sales_amount
        FROM 
            api_sale s
        JOIN 
            api_saleitem si ON s.id = si.sale_id
        JOIN 
            api_product p ON si.product_id = p.id
        WHERE 
            s.date BETWEEN start_date AND end_date
    ),
    product_sales AS (
        SELECT 
            p.name::TEXT AS product_name,
            SUM(si.quantity)::INTEGER AS total_quantity,
            SUM(si.quantity * p.price)::FLOAT AS total_amount
        FROM 
            api_sale s
        JOIN 
            api_saleitem si ON s.id = si.sale_id
        JOIN 
            api_product p ON si.product_id = p.id
        WHERE 
            s.date BETWEEN start_date AND end_date
        GROUP BY 
            p.name
    )
    SELECT 
        ps.product_name,
        ps.total_quantity,
        ps.total_amount,
        (ps.total_amount / ts.total_sales_amount) * 100 AS percentage
    FROM 
        product_sales ps,
        total_sales ts;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;