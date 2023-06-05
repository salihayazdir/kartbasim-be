INSERT INTO [dbo].[USER_ROLES] ([name] )
    VALUES 
    ('Yetkisiz'),
    ('Kullanıcı'), 
    ('Admin'),
	('GMY')

INSERT INTO [dbo].[USERS] 
    ([sicil], [name], [username], [mail], [user_role_id], [created_at] ) VALUES
    ( 'sicil1', 'Kullanıcı 1 İsmi', 'username1', 'user1@mail.com', 1, GETDATE()),
    ( 'sicil2', 'Kullanıcı 2 İsmi', 'username2', 'user2@mail.com', 1, GETDATE()),
    ( 'sicil3', 'Kullanıcı 3 İsmi', 'username3', 'user3@mail.com', 2, GETDATE()),
    ( 'sicil4', 'Kullanıcı 4 İsmi', 'username4', 'user4@mail.com', 2, GETDATE()),
    ( 'sicil5', 'Kullanıcı 5 İsmi', 'username5', 'user5@mail.com', 3, GETDATE());

INSERT INTO [dbo].[BANKS] 
    ([name], [created_at], [created_by] ) VALUES
    ( 'Ziraat Bankası', GETDATE() , 'username1'),
    ( 'VakıfBank', GETDATE() , 'username1'),
    ( 'Halk Bankası', GETDATE() , 'username2'),
    ( 'Vakıf Katılım', GETDATE() , 'username3'),
    ( 'Ziraat Katılım', GETDATE() , 'username3')

INSERT INTO [dbo].[PRODUCT_TYPES] 
    ([name], [created_at], [created_by] ) VALUES
    ( 'Temassız', GETDATE() , 'username1'),
    ( 'Temaslı', GETDATE() , 'username1'),
    ( 'Debit', GETDATE() , 'username1'),
    ( 'Çipli Debit', GETDATE() , 'username1'),
    ( 'Diğer', GETDATE() , 'username1')

INSERT INTO [dbo].[PRODUCT_GROUPS] 
    ([name], [bank_id], [client_id], [description], [created_at], [created_by] ) VALUES
    ( 'Ziraat Prepaid Debit', 1, 'PRPDDBT', '', GETDATE() , 'username1'),
    ( 'Ziraat Standart KK', 1, 'STDKRDK', '', GETDATE() , 'username1'),
    ( 'Ziraat Bankkart Kombo', 1, 'BNKKRTCMB', '', GETDATE() , 'username1'),
    ( 'Halk Dual', 1, 'DUAL', '', GETDATE() , 'username1')

INSERT INTO [dbo].[PRODUCTS] 
    ([name], [product_group_id], [product_type_id], [client_id], [description], [main_safe_quantity], [daily_safe_quantity], [created_at], [created_by] ) VALUES
    ( 'MC BSK COMBO TİCARİ KURUMSAL', 3, 1, 'PRPDDBT-TCKR-1', '', 500, 10, GETDATE(), 'username1'),
    ( 'VC Bkkrt Prestij  Başak Combo', 3, 1, 'PRPDDBT-PRBS-1', '', 250, 50, GETDATE(), 'username2'),
    ( 'MC Başak TİCARİ TOBB Combo', 3, 1, 'PRPDDBT-TOBB-1', '', 100, 0, GETDATE(), 'username2'),
    ( 'VC PARAF KOBİ DUAL', 4, 2, 'DUAL-1', '', 75, 10, GETDATE(), 'username4'),
    ( 'VC PARAF TOBB DUAL', 4, 2, 'DUAL-TOBB', '', 75, 10, GETDATE(), 'username4')

INSERT INTO [dbo].[PRODUCT_STOCK_RECORD_TYPES] 
    ([name] ) VALUES
    ('Stok Girişi'),
    ('Kart Basım'),
    ('Iskarta')

INSERT INTO [dbo].[PRODUCT_STOCK_RECORDS] 
    ([product_id], [product_stock_record_type_id], [is_main_safe], [created_at], [created_by] ) VALUES
    (3, 1, 1, GETDATE(), 'username1')

INSERT INTO [dbo].[CONSUMABLE_TYPES] 
    ([name], [created_at], [created_by] ) VALUES
    ( 'Zarf', GETDATE() , 'username5'),
    ( 'İnsert', GETDATE() , 'username5')

INSERT INTO [dbo].[CONSUMABLES] 
    ([name], [consumable_type_id], [multiplier], [created_at], [created_by] ) VALUES
    ( 'Zarf MC BSK COMBO TİCARİ KURUMSAL', 1, 1, GETDATE() , 'username5'),
    ( 'Zarf VC Bkkrt Prestij  Başak Combo', 1, 1, GETDATE() , 'username5'),
    ( 'Zarf MC Başak TİCARİ TOBB Combo', 1, 1, GETDATE() , 'username5')

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
    (1, '', '', GETDATE(), 'username4'),
    (1, '', '', GETDATE(), 'username4'),
    (2, '', '', GETDATE(), 'username4')

INSERT INTO [dbo].[ICMAL] 
    ([description], [client_description], [batch_id], [product_id], [icmal_delivery_type_id], [icmal_source_type_id], [quantity], [created_at], [created_by] ) VALUES
    ('', '', 1, 1, 1, 2, 50, GETDATE(), 'username4'),
    ('', '', 1, 1, 1, 1, 50, GETDATE(), 'username5')

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

INSERT INTO [dbo].[PRINTERS] 
    ([name], [description], [model], [serial_no], [created_at], [created_by] ) VALUES
    ('Makine 1', 'Açıklama...', 'MODEL123', 'ASDQWE789ZXC', GETDATE(), 'username4'),
    ('Makine 2', 'Açıklama...', 'MODEL456', 'ASDQWE345ZXC', GETDATE(), 'username4'),
    ('Makine 3', 'Açıklama...', 'MODEL123', 'ASDQWE456ZXC', GETDATE(), 'username4')
