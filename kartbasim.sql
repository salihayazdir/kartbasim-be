DROP TABLE IF EXISTS [dbo].[banks]
DROP PROCEDURE IF EXISTS [dbo].[banks_getBank]
DROP PROCEDURE IF EXISTS [dbo].[banks_getBanks]
DROP PROCEDURE IF EXISTS [dbo].[banks_addBank]
DROP PROCEDURE IF EXISTS [dbo].[banks_editBank]
DROP PROCEDURE IF EXISTS [dbo].[banks_deleteBank]

CREATE TABLE [dbo].[banks](
    [bank_id] INT IDENTITY(1, 1) PRIMARY KEY,
    [bank_name] NVARCHAR(255) NOT NULL,
    [is_active] BIT NOT NULL
);

CREATE UNIQUE INDEX banks_bank_name_unique ON
    [dbo].[banks] ([bank_name]);
GO

CREATE PROCEDURE [dbo].[banks_getBank]
	@bankId INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[banks]
		WHERE [bank_id] = @bankId
	END;
GO

CREATE PROCEDURE [dbo].[banks_getBanks]
	AS
	BEGIN 
     SET NOCOUNT ON;
		SELECT *
		FROM [dbo].[banks]
	END;
GO

CREATE PROCEDURE [dbo].[banks_addBank]
	@bankName NVARCHAR(255)
	AS
	BEGIN 
     SET NOCOUNT ON;
		INSERT INTO [dbo].[banks]
		(
			[bank_name],
			[is_active]
		)
		VALUES
		(
			@bankName,
			1
		)
		SELECT SCOPE_IDENTITY()
	END;
GO

CREATE PROCEDURE [dbo].[banks_editBank]
	@bankName NVARCHAR(255),
	@bankId INT,
	@isActive BIT
	AS
	BEGIN 
     SET NOCOUNT ON;
		UPDATE [dbo].[banks]
		SET 
			[bank_name] = @bankName,
			[is_active] = @isActive
		WHERE [bank_id] = @bankId
	END;
GO

CREATE PROCEDURE [dbo].[banks_deleteBank]
	@bankId INT
	AS
	BEGIN 
     SET NOCOUNT ON;
		DELETE FROM [dbo].[banks]
		WHERE [bank_id] = @bankId
	END;
GO
