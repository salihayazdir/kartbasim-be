DROP PROCEDURE IF EXISTS [dbo].[BANKS_GET_BANK]
DROP PROCEDURE IF EXISTS [dbo].[BANKS_GET_BANKS]
DROP PROCEDURE IF EXISTS [dbo].[BANKS_ADD_BANK]
DROP PROCEDURE IF EXISTS [dbo].[BANKS_EDIT_BANK]
DROP PROCEDURE IF EXISTS [dbo].[BANKS_DELETE_BANK]

DROP PROCEDURE IF EXISTS [dbo].[PRINTERS_GET_PRINTER]
DROP PROCEDURE IF EXISTS [dbo].[PRINTERS_GET_PRINTERS]
DROP PROCEDURE IF EXISTS [dbo].[PRINTERS_ADD_PRINTER]
DROP PROCEDURE IF EXISTS [dbo].[PRINTERS_EDIT_PRINTER]
DROP PROCEDURE IF EXISTS [dbo].[PRINTERS_DELETE_PRINTER]

DROP PROCEDURE IF EXISTS [dbo].[SHIFTS_GET_SHIFT]
DROP PROCEDURE IF EXISTS [dbo].[SHIFTS_GET_SHIFTS]
DROP PROCEDURE IF EXISTS [dbo].[SHIFTS_ADD_SHIFT]
DROP PROCEDURE IF EXISTS [dbo].[SHIFTS_EDIT_SHIFT]
DROP PROCEDURE IF EXISTS [dbo].[SHIFTS_DELETE_SHIFT]

DROP PROCEDURE IF EXISTS [dbo].[USERS_ADD_USER]
DROP PROCEDURE IF EXISTS [dbo].[USERS_SET_ALL_INACTIVE]
DROP PROCEDURE IF EXISTS [dbo].[USERS_GET_USER]

DROP PROCEDURE IF EXISTS [dbo].[AUTH_OTP_ADD_OTP]
DROP PROCEDURE IF EXISTS [dbo].[AUTH_OTP_GET_OTP]

DROP PROCEDURE IF EXISTS [dbo].[AUTH_SESSION_ADD_SESSION]
DROP PROCEDURE IF EXISTS [dbo].[AUTH_SESSION_GET_SESSION]
DROP PROCEDURE IF EXISTS [dbo].[AUTH_SESSION_END_SESSION]

DROP PROCEDURE IF EXISTS [dbo].[PRODUCT_GROUPS_GET_PRODUCT_GROUP]
DROP PROCEDURE IF EXISTS [dbo].[PRODUCT_GROUPS_GET_PRODUCT_GROUPS]
DROP PROCEDURE IF EXISTS [dbo].[PRODUCT_GROUPS_ADD_PRODUCT_GROUP]
DROP PROCEDURE IF EXISTS [dbo].[PRODUCT_GROUPS_EDIT_PRODUCT_GROUP]
DROP PROCEDURE IF EXISTS [dbo].[PRODUCT_GROUPS_DELETE_PRODUCT_GROUP]

DROP PROCEDURE IF EXISTS [dbo].[PRODUCT_TYPES_GET_PRODUCT_TYPE]
DROP PROCEDURE IF EXISTS [dbo].[PRODUCT_TYPES_GET_PRODUCT_TYPES]
DROP PROCEDURE IF EXISTS [dbo].[PRODUCT_TYPES_ADD_PRODUCT_TYPE]
DROP PROCEDURE IF EXISTS [dbo].[PRODUCT_TYPES_EDIT_PRODUCT_TYPE]
DROP PROCEDURE IF EXISTS [dbo].[PRODUCT_TYPES_DELETE_PRODUCT_TYPE]

DROP PROCEDURE IF EXISTS [dbo].[PRODUCTS_GET_PRODUCT]
DROP PROCEDURE IF EXISTS [dbo].[PRODUCTS_GET_PRODUCTS]
DROP PROCEDURE IF EXISTS [dbo].[PRODUCTS_ADD_PRODUCT]
DROP PROCEDURE IF EXISTS [dbo].[PRODUCTS_EDIT_PRODUCT]
DROP PROCEDURE IF EXISTS [dbo].[PRODUCTS_DELETE_PRODUCT]

DROP PROCEDURE IF EXISTS [dbo].[CONSUMABLE_TYPES_GET_CONSUMABLE_TYPE]
DROP PROCEDURE IF EXISTS [dbo].[CONSUMABLE_TYPES_GET_CONSUMABLE_TYPES]
DROP PROCEDURE IF EXISTS [dbo].[CONSUMABLE_TYPES_ADD_CONSUMABLE_TYPE]
DROP PROCEDURE IF EXISTS [dbo].[CONSUMABLE_TYPES_EDIT_CONSUMABLE_TYPE]
DROP PROCEDURE IF EXISTS [dbo].[CONSUMABLE_TYPES_DELETE_CONSUMABLE_TYPE]

DROP PROCEDURE IF EXISTS [dbo].[CONSUMABLES_GET_CONSUMABLE]
DROP PROCEDURE IF EXISTS [dbo].[CONSUMABLES_GET_CONSUMABLES]
DROP PROCEDURE IF EXISTS [dbo].[CONSUMABLES_ADD_CONSUMABLE]
DROP PROCEDURE IF EXISTS [dbo].[CONSUMABLES_EDIT_CONSUMABLE]
DROP PROCEDURE IF EXISTS [dbo].[CONSUMABLES_DELETE_CONSUMABLE]

DROP PROCEDURE IF EXISTS [dbo].[PRODUCT_INVENTORY_RECORDS_GET_PRODUCT_INVENTORY_RECORDS]



GO
CREATE OR ALTER PROCEDURE [dbo].[BANKS_GET_BANK]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[BANKS]
		WHERE [id] = @id AND [is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[BANKS_GET_BANKS]
	AS
	BEGIN 
     SET NOCOUNT ON;
	SELECT
		banks.[id],
		banks.[name],
		banks.[is_active],
		banks.[is_deleted],
		banks.[created_at],
		banks.[edited_at],
		users1.[name] created_by,
		users2.[name] edited_by
	FROM [dbo].[BANKS] banks
	LEFT JOIN [dbo].[USERS] users1
		ON banks.[created_by] = users1.[username]
	LEFT JOIN [dbo].[USERS] users2
		ON banks.[edited_by] = users2.[username]
	WHERE banks.[is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[BANKS_ADD_BANK]
	@name NVARCHAR(255),
	@created_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		BEGIN
			INSERT INTO [dbo].[BANKS]
			(
				[name],
				[is_active],
				[is_deleted],
				[created_by],
				[created_at]
			)
			VALUES
			(
				@name,
				1,
				0,
				@created_by,
				GETDATE()
			)
			RETURN SCOPE_IDENTITY()
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[BANKS_EDIT_BANK]
	@name NVARCHAR(255),
	@id INT,
	@is_active BIT,
	@edited_by  NVARCHAR(50) = NULL
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[BANKS] WHERE [id] = @id  AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[BANKS]
			SET 
				[name] = @name,
				[is_active] = @is_active,
				[edited_by] = @edited_by,
				[edited_at] = GETDATE()
			WHERE [id] = @id AND [is_deleted] = 0
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[BANKS_DELETE_BANK]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[BANKS] WHERE [id] = @id AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[BANKS]
			SET 
				[is_deleted] = 1,
				[is_active] = 0
			WHERE [id] = @id
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

GO
CREATE OR ALTER PROCEDURE [dbo].[PRINTERS_GET_PRINTER]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[PRINTERS]
		WHERE [id] = @id AND [is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRINTERS_GET_PRINTERS]
	AS
	BEGIN 
	SET NOCOUNT ON;
		SELECT
			printers.[id],
			printers.[name],
			printers.[description],
			printers.[model],
			printers.[serial_no],
			printers.[counter],
			printers.[is_active],
			printers.[is_deleted],
			printers.[created_at],
			printers.[edited_at],
			users1.[name] created_by,
			users2.[name] edited_by
		FROM [dbo].[PRINTERS] printers
		LEFT JOIN [dbo].[USERS] users1
			ON printers.[created_by] = users1.[username]
		LEFT JOIN [dbo].[USERS] users2
			ON printers.[edited_by] = users2.[username]
		WHERE printers.[is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRINTERS_ADD_PRINTER]
	@name NVARCHAR(255),
	@model NVARCHAR(255),
	@serial_no NVARCHAR(255),
	@description NVARCHAR(1000),
	@created_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		BEGIN
			INSERT INTO [dbo].[PRINTERS]
			(
				[name],
				[model],
				[serial_no],
				[description],
				[is_active],
				[is_deleted],
				[created_by],
				[created_at]
			)
			VALUES
			(
				@name,
				@model,
				@serial_no,
				@description,
				1,
				0,
				@created_by,
				GETDATE()
			)
			RETURN SCOPE_IDENTITY()
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRINTERS_EDIT_PRINTER]
	@name NVARCHAR(255),
	@model NVARCHAR(255),
	@serial_no NVARCHAR(255),
	@description NVARCHAR(1000),
	@id INT,
	@is_active BIT,
	@edited_by  NVARCHAR(50) = NULL
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[PRINTERS] WHERE [id] = @id  AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[PRINTERS]
			SET 
				[name] = @name,
				[model] = @model,
				[serial_no] = @serial_no,
				[description] = @description,
				[is_active] = @is_active,
				[edited_by] = @edited_by,
				[edited_at] = GETDATE()
			WHERE [id] = @id AND [is_deleted] = 0
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRINTERS_DELETE_PRINTER]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[PRINTERS] WHERE [id] = @id AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[PRINTERS]
			SET 
				[is_deleted] = 1,
				[is_active] = 0
			WHERE [id] = @id
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[USERS_ADD_USER]
	@sicil NVARCHAR (50),
    @name NVARCHAR (200),
	@user_role_id INT ,
    @dn  NVARCHAR (1000),
    @title  NVARCHAR (200),
    @team  NVARCHAR (200),
    @service  NVARCHAR (200),
    @department  NVARCHAR (200),
    @username  NVARCHAR (50),
    @mail  NVARCHAR (200),
    @manager_dn  NVARCHAR (200),
	@source NVARCHAR(10)

	AS
	BEGIN
     SET NOCOUNT ON;
	 	IF EXISTS (SELECT [username] FROM [dbo].[USERS] WHERE [username] = @username)
			BEGIN
				UPDATE [dbo].[USERS] SET
					[sicil] = @sicil,
					[name] = @name,
					[dn] = @dn,
					[title] = @title,
					[team] = @team,
					[service] = @service,
					[department] = @department,
					[mail] = @mail,
					[manager_dn] = @manager_dn,
					[is_active] = 1,
					[edited_at] = GETDATE()
				WHERE [username] = @username
			END
		ELSE	
			BEGIN
				INSERT INTO [dbo].[USERS]
				(
					[sicil],
					[name],
					[user_role_id],
					[dn],
					[title],
					[team],
					[service],
					[department],
					[username],
					[mail],
					[manager_dn],
					[source],
					[created_at]
				)
				VALUES
				(
					@sicil,
					@name,
					@user_role_id,
					@dn,
					@title,
					@team,
					@service,
					@department,
					@username,
					@mail,
					@manager_dn,
					@source,
					GETDATE()
				)
				RETURN SCOPE_IDENTITY()
			END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[USERS_SET_ALL_INACTIVE]
	AS
	BEGIN 
     SET NOCOUNT ON;
		UPDATE [dbo].[USERS]
		SET [is_active] = 0
		WHERE [source] = 'bilesim_ad'
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[USERS_GET_USER]
	@username NVARCHAR (50)
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT 
			usr.*,
			manager.name manager_name,
			manager.username manager_username
		FROM
			[dbo].[USERS] usr
			LEFT JOIN [dbo].[USERS] manager
				ON usr.manager_dn = manager.dn
		WHERE usr.[username] = @username AND usr.[is_active] = 1 AND manager.[is_active] = 1
	END;
GO

GO
CREATE OR ALTER PROCEDURE [dbo].[AUTH_OTP_ADD_OTP]
	@otp NVARCHAR(500),
	@username NVARCHAR(50)
	AS
	BEGIN
		BEGIN TRANSACTION;
		BEGIN TRY
			DELETE FROM [dbo].[AUTH_OTP]
				WHERE [username] = @username;
			INSERT INTO [dbo].[AUTH_OTP]
				(
					[code],
					[username],
					[created_at]
				)
				VALUES
				(
					@otp,
					@username,
					GETDATE()
				);
			COMMIT TRANSACTION
		END TRY
		BEGIN CATCH
			IF @@TRANCOUNT > 0
			BEGIN
				ROLLBACK TRANSACTION;
			END
		END CATCH
	END;
GO


CREATE OR ALTER PROCEDURE [dbo].[AUTH_OTP_GET_OTP]
	@username NVARCHAR (50)
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[AUTH_OTP]
		WHERE [username] = @username;
	END;
GO

GO
CREATE OR ALTER PROCEDURE [dbo].[AUTH_SESSION_ADD_SESSION]
	@username NVARCHAR(50)
	AS
	BEGIN
		DECLARE @sessionId INT;
		BEGIN TRANSACTION;
		BEGIN TRY
			DELETE FROM [dbo].[AUTH_SESSION]
				WHERE [username] = @username;
			INSERT INTO [dbo].[AUTH_SESSION]
				(
					[username],
					[created_at]
				)
				VALUES
				(
					@username,
					GETDATE()
				);
			SET @sessionId = SCOPE_IDENTITY()
			COMMIT TRANSACTION
			RETURN @sessionId
		END TRY
		BEGIN CATCH
			IF @@TRANCOUNT > 0
			BEGIN
				ROLLBACK TRANSACTION;
			END
		END CATCH
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[AUTH_SESSION_GET_SESSION]
	@sessionId INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[AUTH_SESSION]
		WHERE [id] = @sessionId;
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[AUTH_SESSION_END_SESSION]
	@username NVARCHAR(50)
	AS
	BEGIN 
     SET NOCOUNT ON;
		DELETE FROM [dbo].[AUTH_SESSION]
			WHERE [username] = @username;
		RETURN SCOPE_IDENTITY()
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCT_GROUPS_GET_PRODUCT_GROUP]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[PRODUCT_GROUPS]
		WHERE [id] = @id AND [is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCT_GROUPS_GET_PRODUCT_GROUPS]
	AS
	BEGIN 
    SET NOCOUNT ON;
		SELECT
			productGroups.[id],
    		productGroups.[name],
    		productGroups.[bank_id],
			banks.[name] bank_name,
			productGroups.[client_id],
			productGroups.[description],
    		productGroups.[is_active],
    		productGroups.[is_deleted],
    		productGroups.[created_at],
    		productGroups.[edited_at],
    		productGroups.[created_by],
    		productGroups.[edited_by],
			users1.[name] created_by_name,
			users2.[name] edited_by_name
		FROM [dbo].[PRODUCT_GROUPS] productGroups
		LEFT JOIN [dbo].[USERS] users1
			ON productGroups.[created_by] = users1.[username]
		LEFT JOIN [dbo].[USERS] users2
			ON productGroups.[edited_by] = users2.[username]
		LEFT JOIN [dbo].[BANKS] banks
			ON productGroups.[bank_id] = banks.[id]
		WHERE productGroups.[is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCT_GROUPS_ADD_PRODUCT_GROUP]
	@name NVARCHAR(50),
	@bank_id INT,
	@client_id NVARCHAR(100) = NULL,
	@description NVARCHAR(500),
	@created_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		BEGIN
			INSERT INTO [dbo].[PRODUCT_GROUPS]
			(
				[name],
				[bank_id],
				[client_id],
				[description],
				[is_active],
				[is_deleted],
				[created_by],
				[created_at]
			)
			VALUES
			(
				@name,
				@bank_id,
				@client_id,
				@description,
				1,
				0,
				@created_by,
			    GETDATE()
			)
			RETURN SCOPE_IDENTITY()
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCT_GROUPS_EDIT_PRODUCT_GROUP]
	@id INT,
	@name NVARCHAR(50),
	@bank_id INT,
	@client_id NVARCHAR(100),
	@description NVARCHAR(500),
	@is_active BIT,
	@edited_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[PRODUCT_GROUPS] WHERE [id] = @id  AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[PRODUCT_GROUPS]
			SET 
				[name] = @name,
				[bank_id] = @bank_id,
				[client_id] = @client_id,
				[description] = @description,
				[is_active] = @is_active,
				[edited_by] = @edited_by,
				[edited_at] = GETDATE()
			WHERE [id] = @id AND [is_deleted] = 0
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCT_GROUPS_DELETE_PRODUCT_GROUP]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[PRODUCT_GROUPS] WHERE [id] = @id AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[PRODUCT_GROUPS]
			SET 
				[is_deleted] = 1,
				[is_active] = 0
			WHERE [id] = @id
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

GO
CREATE OR ALTER PROCEDURE [dbo].[PRODUCT_TYPES_GET_PRODUCT_TYPE]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[PRODUCT_TYPES]
		WHERE [id] = @id AND [is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCT_TYPES_GET_PRODUCT_TYPES]
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT
			productTypes.[id],
    		productTypes.[name],
    		productTypes.[is_active],
    		productTypes.[is_deleted],
    		productTypes.[created_at],
    		productTypes.[edited_at],
    		productTypes.[created_by],
    		productTypes.[edited_by],
			users1.[name] created_by_name,
			users2.[name] edited_by_name
		FROM [dbo].[PRODUCT_TYPES] productTypes
		LEFT JOIN [dbo].[USERS] users1
			ON productTypes.[created_by] = users1.[username]
		LEFT JOIN [dbo].[USERS] users2
			ON productTypes.[edited_by] = users2.[username]
		WHERE productTypes.[is_deleted] = 0
	END;
GO


CREATE OR ALTER PROCEDURE [dbo].[PRODUCT_TYPES_ADD_PRODUCT_TYPE]
	@name NVARCHAR(50),
	@created_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		BEGIN
			INSERT INTO [dbo].[PRODUCT_TYPES]
			(
				[name],
				[is_active],
				[is_deleted],
				[created_by],
				[created_at]
			)
			VALUES
			(
				@name,
				1,
				0,
				@created_by,
			    GETDATE()
			)
			RETURN SCOPE_IDENTITY()
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCT_TYPES_EDIT_PRODUCT_TYPE]
	@id INT,
	@name NVARCHAR(50),
	@is_active BIT,
	@edited_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[PRODUCT_TYPES] WHERE [id] = @id  AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[PRODUCT_TYPES]
			SET 
				[name] = @name,
				[is_active] = @is_active,
				[edited_by] = @edited_by,
				[edited_at] = GETDATE()
			WHERE [id] = @id AND [is_deleted] = 0
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCT_TYPES_DELETE_PRODUCT_TYPE]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[PRODUCT_TYPES] WHERE [id] = @id AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[PRODUCT_TYPES]
			SET 
				[is_deleted] = 1,
				[is_active] = 0
			WHERE [id] = @id
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCTS_GET_PRODUCT]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[PRODUCTS]
		WHERE [id] = @id AND [is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCTS_GET_PRODUCTS]
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT
			products.[id],
    		products.[name],
    		products.[product_group_id],
    		productGroups.[name] product_group_name,
    		banks.[name] bank_name,
    		products.[product_type_id],
    		productTypes.[name] product_type_name,
			products.[client_id],
			products.[description],
			products.[main_safe_quantity],
    		products.[daily_safe_quantity],
    		products.[is_active],
    		products.[is_deleted],
    		products.[created_at],
    		products.[edited_at],
    		products.[created_by],
    		products.[edited_by],
			users1.[name] created_by_name,
			users2.[name] edited_by_name
		FROM [dbo].[PRODUCTS] products
		LEFT JOIN [dbo].[PRODUCT_GROUPS] productGroups
			ON products.[product_group_id] = productGroups.[id]
		LEFT JOIN [dbo].[BANKS] banks
			ON productGroups.[bank_id] = banks.[id]
		LEFT JOIN [dbo].[PRODUCT_TYPES] productTypes
			ON products.[product_type_id] = productTypes.[id]
		LEFT JOIN [dbo].[USERS] users1
			ON products.[created_by] = users1.[username]
		LEFT JOIN [dbo].[USERS] users2
			ON products.[edited_by] = users2.[username]
		WHERE products.[is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCTS_ADD_PRODUCT]
	@name NVARCHAR(50),
	@product_group_id INT,
	@product_type_id INT,
	@client_id NVARCHAR(100) = NULL,
	@description NVARCHAR(500) = NULL,
	@created_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		BEGIN
			INSERT INTO [dbo].[PRODUCTS]
			(
				[name],
				[product_group_id],
				[product_type_id],
				[client_id],
				[description],
				[is_active],
				[is_deleted],
				[created_by],
				[created_at]
			)
			VALUES
			(
				@name,
				@product_group_id,
				@product_type_id,
				@client_id,
				@description,
				1,
				0,
				@created_by,
			    GETDATE()
			)
			RETURN SCOPE_IDENTITY()
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCTS_EDIT_PRODUCT]
	@id INT,
	@name NVARCHAR(50),
	@product_group_id INT,
	@product_type_id INT,
	@client_id NVARCHAR(100) = NULL,
	@description NVARCHAR(500) = NULL,
	@created_by  NVARCHAR(50) = NULL,
	@is_active BIT,
	@edited_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[PRODUCTS] WHERE [id] = @id  AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[PRODUCTS]
			SET 
				[name] = @name,
				[product_group_id] = @product_group_id,
				[product_type_id] = @product_type_id,
				[client_id] = @client_id,
				[description] = @description,
				[is_active] = @is_active,
				[edited_by] = @edited_by,
				[edited_at] = GETDATE()
			WHERE [id] = @id AND [is_deleted] = 0
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCTS_DELETE_PRODUCT]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[PRODUCTS] WHERE [id] = @id AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[PRODUCTS]
			SET 
				[is_deleted] = 1,
				[is_active] = 0
			WHERE [id] = @id
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[CONSUMABLE_TYPES_GET_CONSUMABLE_TYPE]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[CONSUMABLE_TYPES]
		WHERE [id] = @id AND [is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[CONSUMABLE_TYPES_GET_CONSUMABLE_TYPES]
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT
			consumableTypes.[id],
    		consumableTypes.[name],
    		consumableTypes.[is_active],
    		consumableTypes.[is_deleted],
    		consumableTypes.[created_at],
    		consumableTypes.[edited_at],
    		consumableTypes.[created_by],
    		consumableTypes.[edited_by],
			users1.[name] created_by_name,
			users2.[name] edited_by_name
		FROM [dbo].[CONSUMABLE_TYPES] consumableTypes
		LEFT JOIN [dbo].[USERS] users1
			ON consumableTypes.[created_by] = users1.[username]
		LEFT JOIN [dbo].[USERS] users2
			ON consumableTypes.[edited_by] = users2.[username]
		WHERE consumableTypes.[is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[CONSUMABLE_TYPES_ADD_CONSUMABLE_TYPE]
	@name NVARCHAR(50),
	@created_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		BEGIN
			INSERT INTO [dbo].[CONSUMABLE_TYPES]
			(
				[name],
				[is_active],
				[is_deleted],
				[created_by],
				[created_at]
			)
			VALUES
			(
				@name,
				1,
				0,
				@created_by,
			    GETDATE()
			)
			RETURN SCOPE_IDENTITY()
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[CONSUMABLE_TYPES_EDIT_CONSUMABLE_TYPE]
	@id INT,
	@name NVARCHAR(50),
	@is_active BIT,
	@edited_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[CONSUMABLE_TYPES] WHERE [id] = @id  AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[CONSUMABLE_TYPES]
			SET 
				[name] = @name,
				[is_active] = @is_active,
				[edited_by] = @edited_by,
				[edited_at] = GETDATE()
			WHERE [id] = @id AND [is_deleted] = 0
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[CONSUMABLE_TYPES_DELETE_CONSUMABLE_TYPE]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[CONSUMABLE_TYPES] WHERE [id] = @id AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[CONSUMABLE_TYPES]
			SET 
				[is_deleted] = 1,
				[is_active] = 0
			WHERE [id] = @id
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO


GO
CREATE OR ALTER PROCEDURE [dbo].[CONSUMABLES_GET_CONSUMABLE]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[CONSUMABLES]
		WHERE [id] = @id AND [is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[CONSUMABLES_GET_CONSUMABLES]
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT
			consumables.[id],
    		consumables.[name],
    		consumables.[consumable_type_id],
    		consumableTypes.[name] consumable_type_name,
			consumables.[stock_quantity],
    		consumables.[is_active],
    		consumables.[is_deleted],
    		consumables.[created_at],
    		consumables.[edited_at],
    		consumables.[created_by],
    		consumables.[edited_by],
			users1.[name] created_by_name,
			users2.[name] edited_by_name
		FROM [dbo].[CONSUMABLES] consumables
		LEFT JOIN [dbo].[CONSUMABLE_TYPES] consumableTypes
			ON consumables.[CONSUMABLE_type_id] = consumableTypes.[id]
		LEFT JOIN [dbo].[USERS] users1
			ON consumables.[created_by] = users1.[username]
		LEFT JOIN [dbo].[USERS] users2
			ON consumables.[edited_by] = users2.[username]
		WHERE consumables.[is_deleted] = 0
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[CONSUMABLES_ADD_CONSUMABLE]
	@name NVARCHAR(50),
	@consumable_type_id INT,
	@description NVARCHAR(500) = NULL,
	@created_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		BEGIN
			INSERT INTO [dbo].[CONSUMABLES]
			(
				[name],
				[consumable_type_id],
				[description],
				[is_active],
				[is_deleted],
				[created_by],
				[created_at]
			)
			VALUES
			(
				@name,
				@consumable_type_id,
				@description,
				1,
				0,
				@created_by,
			    GETDATE()
			)
			RETURN SCOPE_IDENTITY()
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[CONSUMABLES_EDIT_CONSUMABLE]
	@id INT,
	@name NVARCHAR(50),
	@consumable_type_id INT,
	@description NVARCHAR(500) = NULL,
	@created_by  NVARCHAR(50) = NULL,
	@is_active BIT,
	@edited_by  NVARCHAR(50) = NULL
	AS
	BEGIN
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[CONSUMABLES] WHERE [id] = @id  AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[CONSUMABLES]
			SET 
				[name] = @name,
				[consumable_type_id] = @consumable_type_id,
				[description] = @description,
				[is_active] = @is_active,
				[edited_by] = @edited_by,
				[edited_at] = GETDATE()
			WHERE [id] = @id AND [is_deleted] = 0
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[CONSUMABLES_DELETE_CONSUMABLE]
	@id INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		IF EXISTS (SELECT [id] FROM [dbo].[CONSUMABLES] WHERE [id] = @id AND [is_deleted] = 0)
		BEGIN
			UPDATE [dbo].[CONSUMABLES]
			SET 
				[is_deleted] = 1,
				[is_active] = 0
			WHERE [id] = @id
			RETURN @id
		END
		ELSE
		BEGIN
			RETURN -1
		END
	END;
GO

CREATE OR ALTER PROCEDURE [dbo].[PRODUCT_INVENTORY_RECORDS_GET_PRODUCT_INVENTORY_RECORDS]
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT
			records.[id],
			records.[product_id],
				products.[name] product_name,
				product_groups.[name] product_group_name,
				product_types.[name] product_type_name,
				banks.[name] bank_name,
			records.[product_inventory_record_type_id],
				record_types.[name] product_inventory_record_type_name,
			records.[quantity],
			records.[batch_id],
			records.[is_main_safe],
			records.[created_at],
			users.[name] created_by_name
		FROM [dbo].[PRODUCT_INVENTORY_RECORDS] records
		LEFT JOIN [dbo].[USERS] users
			ON records.[created_by] = users.[username]
		LEFT JOIN [dbo].[PRODUCTS] products
			ON records.[product_id] = products.[id]
		LEFT JOIN [dbo].[PRODUCT_GROUPS] product_groups
			ON products.[product_group_id] = product_groups.[id]
		LEFT JOIN [dbo].[BANKS] banks
			ON product_groups.[bank_id] = banks.[id]
		LEFT JOIN [dbo].[PRODUCT_TYPES] product_types
			ON products.[product_type_id] = product_types.[id]
		LEFT JOIN [dbo].[PRODUCT_INVENTORY_RECORD_TYPES] record_types
			ON records.[product_inventory_record_type_id] = record_types.[id]
		LEFT JOIN [dbo].[BATCH] batch
			ON records.[batch_id] = batch.[id]
	END;
GO
