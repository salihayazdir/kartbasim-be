INSERT INTO [dbo].[USER_ROLES] ([name] )
    VALUES 
    ('ROL 1'),
    ('ROL 2'), 
    ('ROL 3')

INSERT INTO [dbo].[USERS] 
    ([sicil], [name], [user_role_id] ) VALUES
    ( '1011', 'Kullanıcı 1 İsmi', 1),
    ( '1012', 'Kullanıcı 2 İsmi', 1),
    ( '1013', 'Kullanıcı 3 İsmi', 2),
    ( '1014', 'Kullanıcı 4 İsmi', 2),
    ( '1015', 'Kullanıcı 5 İsmi', 3);

INSERT INTO [dbo].[BANKS] 
    ([name], [created_at], [created_by] ) VALUES
    ( 'Ziraat Bankası', GETDATE() , '1011'),
    ( 'VakıfBank', GETDATE() , '1011'),
    ( 'Halk Bankası', GETDATE() , '1012'),
    ( 'Vakıf Katılım', GETDATE() , '1013'),
    ( 'Ziraat Katılım', GETDATE() , '1013')

INSERT INTO [dbo].[PRODUCT_TYPES] 
    ([name], [created_at], [created_by] ) VALUES
    ( 'Temassız', GETDATE() , '1011'),
    ( 'Temaslı', GETDATE() , '1011'),
    ( 'Debit', GETDATE() , '1011'),
    ( 'Çipli Debit', GETDATE() , '1011'),
    ( 'Diğer', GETDATE() , '1011')

INSERT INTO [dbo].[PRODUCT_GROUPS] 
    ([name], [bank_id], [client_id], [description], [created_at], [created_by] ) VALUES
    ( 'Ziraat Prepaid Debit', 1, 'PRPDDBT', '', GETDATE() , '1011'),
    ( 'Ziraat Standart KK', 1, 'STDKRDK', '', GETDATE() , '1011'),
    ( 'Ziraat Bankkart Kombo', 1, 'BNKKRTCMB', '', GETDATE() , '1011'),
    ( 'Halk Dual', 1, 'DUAL', '', GETDATE() , '1011')

INSERT INTO [dbo].[PRODUCTS] 
    ([name], [product_group_id], [product_type_id], [client_id], [description], [main_safe_quantity], [daily_safe_quantity], [created_at], [created_by] ) VALUES
    ( 'MC BSK COMBO TİCARİ KURUMSAL', 3, 1, 'PRPDDBT-TCKR-1', '', 500, 10, GETDATE(), '1011'),
    ( 'VC Bkkrt Prestij  Başak Combo', 3, 1, 'PRPDDBT-PRBS-1', '', 250, 50, GETDATE(), '1012'),
    ( 'MC Başak TİCARİ TOBB Combo', 3, 1, 'PRPDDBT-TOBB-1', '', 100, 0, GETDATE(), '1012'),
    ( 'VC PARAF KOBİ DUAL', 4, 2, 'DUAL-1', '', 75, 10, GETDATE(), '1014'),
    ( 'VC PARAF TOBB DUAL', 4, 2, 'DUAL-TOBB', '', 75, 10, GETDATE(), '1014')

INSERT INTO [dbo].[PRODUCT_STOCK_RECORD_TYPES] 
    ([name] ) VALUES
    ('Stok Girişi'),
    ('Kart Basım'),
    ('Iskarta')

INSERT INTO [dbo].[PRODUCT_STOCK_RECORDS] 
    ([product_id], [product_stock_record_type_id], [is_main_safe], [created_at], [created_by] ) VALUES
    (3, 1, 1, GETDATE(), '1011')

INSERT INTO [dbo].[CONSUMABLE_TYPES] 
    ([name], [created_at], [created_by] ) VALUES
    ( 'Zarf', GETDATE() , '1015'),
    ( 'İnsert', GETDATE() , '1015')

INSERT INTO [dbo].[CONSUMABLES] 
    ([name], [consumable_type_id], [multiplier], [created_at], [created_by] ) VALUES
    ( 'Zarf MC BSK COMBO TİCARİ KURUMSAL', 1, 1, GETDATE() , '1015'),
    ( 'Zarf VC Bkkrt Prestij  Başak Combo', 1, 1, GETDATE() , '1015'),
    ( 'Zarf MC Başak TİCARİ TOBB Combo', 1, 1, GETDATE() , '1015')

INSERT INTO [dbo].[CONSUMABLE_PRODUCT_RECORDS] 
    ([consumable_id], [product_id] ) VALUES
    (1,1),
    (2,2),
    (3,3)

INSERT INTO [dbo].[ICMAL_DELIVERY_TYPES] 
    ([name] ) VALUES
    ('Posta'),
    ('Şube')

INSERT INTO [dbo].[ICMAL_SOURCE_TYPES] 
    ([name] ) VALUES
    ('Web Servis'),
    ('Manuel'),
    ('Banka Portal')

INSERT INTO [dbo].[BATCH] 
    ([bank_id], [description], [client_description], [created_at], [created_by] ) VALUES
    (1, '', '', GETDATE(), '1014'),
    (1, '', '', GETDATE(), '1014'),
    (2, '', '', GETDATE(), '1014')

INSERT INTO [dbo].[ICMAL] 
    ([description], [client_description], [batch_id], [product_id], [icmal_delivery_type_id], [icmal_source_type_id], [quantity], [created_at], [created_by] ) VALUES
    ('', '', 1, 1, 1, 2, 50, GETDATE(), '1014'),
    ('', '', 1, 1, 1, 1, 50, GETDATE(), '1015')

INSERT INTO [dbo].[ICMAL_STATUSES] 
    ([name] ) VALUES
    ('Yeni'),
    ('Sırada'),
    ('Basımda'),
    ('Basıldı'),
    ('Devir'),
    ('İptal')

INSERT INTO [dbo].[ICMAL_STATUS_RECORDS] 
    ([icmal_id], [icmal_status_id], [created_at] ) VALUES
    (1,2, GETDATE() ),
    (1,3, GETDATE() ),
    (2,2, GETDATE() ),
    (2,3, GETDATE() )