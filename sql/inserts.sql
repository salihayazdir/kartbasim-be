INSERT INTO [dbo].[USER_ROLES] ([NAME] )
    VALUES 
    ('ROL 1'),
    ('ROL 2'), 
    ('ROL 3')

INSERT INTO [dbo].[USERS] 
    ([SICIL], [NAME], [USER_ROLE_ID] ) VALUES
    ( '1011', 'Kullanıcı 1 İsmi', 1),
    ( '1012', 'Kullanıcı 2 İsmi', 1),
    ( '1013', 'Kullanıcı 3 İsmi', 2),
    ( '1014', 'Kullanıcı 4 İsmi', 2),
    ( '1015', 'Kullanıcı 5 İsmi', 3);

INSERT INTO [dbo].[BANKS] 
    ([NAME], [CREATED_AT], [CREATED_BY] ) VALUES
    ( 'Ziraat Bankası', GETDATE() , '1011'),
    ( 'VakıfBank', GETDATE() , '1011'),
    ( 'Halk Bankası', GETDATE() , '1012'),
    ( 'Vakıf Katılım', GETDATE() , '1013'),
    ( 'Ziraat Katılım', GETDATE() , '1013')

INSERT INTO [dbo].[PRODUCT_TYPES] 
    ([NAME], [CREATED_AT], [CREATED_BY] ) VALUES
    ( 'Temassız', GETDATE() , '1011'),
    ( 'Temaslı', GETDATE() , '1011'),
    ( 'Debit', GETDATE() , '1011'),
    ( 'Çipli Debit', GETDATE() , '1011'),
    ( 'Diğer', GETDATE() , '1011')

INSERT INTO [dbo].[PRODUCT_GROUPS] 
    ([NAME], [BANK_ID], [CLIENT_ID], [DESCRIPTION], [CREATED_AT], [CREATED_BY] ) VALUES
    ( 'Ziraat Prepaid Debit', 1, 'PRPDDBT', '', GETDATE() , '1011'),
    ( 'Ziraat Standart KK', 1, 'STDKRDK', '', GETDATE() , '1011'),
    ( 'Ziraat Bankkart Kombo', 1, 'BNKKRTCMB', '', GETDATE() , '1011'),
    ( 'Halk Dual', 1, 'DUAL', '', GETDATE() , '1011')

INSERT INTO [dbo].[PRODUCTS] 
    ([NAME], [PRODUCT_GROUP_ID], [PRODUCT_TYPE_ID], [CLIENT_ID], [DESCRIPTION], [MAIN_SAFE_QUANTITY], [DAILY_SAFE_QUANTITY], [CREATED_AT], [CREATED_BY] ) VALUES
    ( 'MC BSK COMBO TİCARİ KURUMSAL', 3, 1, 'PRPDDBT-TCKR-1', '', 500, 10, GETDATE(), '1011'),
    ( 'VC Bkkrt Prestij  Başak Combo', 3, 1, 'PRPDDBT-PRBS-1', '', 250, 50, GETDATE(), '1012'),
    ( 'MC Başak TİCARİ TOBB Combo', 3, 1, 'PRPDDBT-TOBB-1', '', 100, 0, GETDATE(), '1012'),
    ( 'VC PARAF KOBİ DUAL', 4, 2, 'DUAL-1', '', 75, 10, GETDATE(), '1014'),
    ( 'VC PARAF TOBB DUAL', 4, 2, 'DUAL-TOBB', '', 75, 10, GETDATE(), '1014')

INSERT INTO [dbo].[PRODUCT_STOCK_RECORD_TYPES] 
    ([NAME] ) VALUES
    ('Stok Girişi'),
    ('Kart Basım'),
    ('Iskarta')

INSERT INTO [dbo].[PRODUCT_STOCK_RECORDS] 
    ([PRODUCT_ID], [PRODUCT_STOCK_RECORD_TYPE_ID], [IS_MAIN_SAFE], [CREATED_AT], [CREATED_BY] ) VALUES
    (3, 1, 1, GETDATE(), '1011')

INSERT INTO [dbo].[CONSUMABLE_TYPES] 
    ([NAME], [CREATED_AT], [CREATED_BY] ) VALUES
    ( 'Zarf', GETDATE() , '1015'),
    ( 'İnsert', GETDATE() , '1015')

INSERT INTO [dbo].[CONSUMABLES] 
    ([NAME], [CONSUMABLE_TYPE_ID], [MULTIPLIER], [CREATED_AT], [CREATED_BY] ) VALUES
    ( 'Zarf MC BSK COMBO TİCARİ KURUMSAL', 1, 1, GETDATE() , '1015'),
    ( 'Zarf VC Bkkrt Prestij  Başak Combo', 1, 1, GETDATE() , '1015'),
    ( 'Zarf MC Başak TİCARİ TOBB Combo', 1, 1, GETDATE() , '1015')

INSERT INTO [dbo].[CONSUMABLE_PRODUCT_RECORDS] 
    ([CONSUMABLE_ID], [PRODUCT_ID] ) VALUES
    (1,1),
    (2,2),
    (3,3)

INSERT INTO [dbo].[ICMAL_DELIVERY_TYPES] 
    ([NAME] ) VALUES
    ('Posta'),
    ('Şube')

INSERT INTO [dbo].[ICMAL_SOURCE_TYPES] 
    ([NAME] ) VALUES
    ('Web Servis'),
    ('Manuel'),
    ('Banka Portal')

INSERT INTO [dbo].[BATCH] 
    ([BANK_ID], [DESCRIPTION], [CLIENT_DESCRIPTION], [CREATED_AT], [CREATED_BY] ) VALUES
    (1, '', '', GETDATE(), '1014'),
    (1, '', '', GETDATE(), '1014'),
    (2, '', '', GETDATE(), '1014')

INSERT INTO [dbo].[ICMAL] 
    ([DESCRIPTION], [CLIENT_DESCRIPTION], [BATCH_ID], [PRODUCT_ID], [ICMAL_DELIVERY_TYPE_ID], [ICMAL_SOURCE_TYPE_ID], [QUANTITY], [CREATED_AT], [CREATED_BY] ) VALUES
    ('', '', 1, 1, 1, 2, 50, GETDATE(), '1014'),
    ('', '', 1, 1, 1, 1, 50, GETDATE(), NULL)

INSERT INTO [dbo].[ICMAL_STATUSES] 
    ([NAME] ) VALUES
    ('Yeni'),
    ('Sırada'),
    ('Basımda'),
    ('Basıldı'),
    ('Devir'),
    ('İptal')

INSERT INTO [dbo].[ICMAL_STATUS_RECORDS] 
    ([ICMAL_ID], [ICMAL_STATUS_ID], [CREATED_AT] ) VALUES
    (1,2, GETDATE() ),
    (1,3, GETDATE() ),
    (2,2, GETDATE() ),
    (2,3, GETDATE() )