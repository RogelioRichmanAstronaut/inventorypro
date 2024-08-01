CREATE OR REPLACE FUNCTION update_inventory(sale_id INT) RETURNS VOID AS $$
DECLARE
    sale_item RECORD;
BEGIN
    FOR sale_item IN 
        SELECT * 
        FROM api_saleitem 
        WHERE api_saleitem.sale_id = update_inventory.sale_id
    LOOP
        UPDATE api_product
        SET balance = balance - sale_item.quantity
        WHERE id = sale_item.product_id;

        -- Check for negative inventory
        IF (SELECT balance FROM api_product WHERE id = sale_item.product_id) < 0 THEN
            -- Raise an exception if inventory is insufficient
            RAISE EXCEPTION 'Insufficient inventory for product id: %', sale_item.product_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;