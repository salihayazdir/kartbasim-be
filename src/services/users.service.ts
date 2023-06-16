import logger from '../utils/logger';
import config from 'config';
import sql, { IProcedureResult, ConnectionPool } from 'mssql';
import { ErrorDetails } from '../data/models';
import toTitleCase from '../utils/toTitleCase';
import { Client, SearchEntryObject, SearchOptions } from 'ldapjs';
const ldap = require('ldapjs');

const dbConfig = config.get<string>('db');
const ldapConfig = config.get<{ ip1: string; ip2: string; user: string; password: string }>('ldap');

export async function updateUsersService(fn: (a: any) => any) {
	try {
		const client: Client = ldap.createClient({
			url: [ldapConfig.ip1, ldapConfig.ip2],
		});

		client.bind(ldapConfig.user, ldapConfig.password, (err) => {
			if (err) {
				logger.error(`LDAP Bind Error : ${err}`);
			}
		});

		const options: SearchOptions = {
			filter: `objectCategory=CN=Person,CN=Schema,CN=Configuration,DC=bilesim,DC=net,DC=tr`,
			scope: 'sub',
			attributes: [
				'extensionAttribute1',
				'dn',
				'cn',
				'title',
				'description',
				'physicalDeliveryOfficeName',
				'memberOf',
				'department',
				'directReports',
				'name',
				'sAMAccountName',
				'managedObjects',
				'objectCategory',
				'mail',
				'manager',
			],
		};

		const ldapData: SearchEntryObject[] = [];

		client.search('OU=BILESIM,DC=bilesim,DC=net,DC=tr', options, (err, res) => {
			if (err) throw `Search Error : ${err}`;

			res.on('searchRequest', (searchRequest) => {
				// console.log('searchRequest: ', searchRequest);
			});

			res.on('searchEntry', (entry) => {
				// console.log('entry: ' + JSON.stringify(entry.attributes));
				ldapData.push(entry.object);
				// ldapData = [...ldapData, entry.object];
			});

			res.on('searchReference', (referral) => {
				// console.log('referral: ' + referral.uris.join());
			});

			res.on('error', (err: any) => {
				// throw err;
				logger.error(`LDAP Search Error : ${err}`);
			});

			res.on('end', (res) => {
				client.unbind(async (err) => {
					if (err) throw `Unbind Error : ${err}`;
					fn(ldapData);
					const pool: Promise<ConnectionPool> = sql.connect(dbConfig);
					(await pool).request().execute('dbo.USERS_SET_ALL_INACTIVE');
					ldapData.map(async (user) => {
						try {
							let userRoleId = 1;
							const authorizedUsers = config.get<string[]>('auth.authorizedUsers');
							if (authorizedUsers.indexOf(user.sAMAccountName as string) !== -1) userRoleId = 2;
							const result: IProcedureResult<any> = await (
								await pool
							)
								.request()
								.input('sicil', sql.NVarChar, user.extensionAttribute1)
								.input('name', sql.NVarChar, toTitleCase(`${user.cn}`))
								.input('user_role_id', sql.Int, userRoleId)
								.input('dn', sql.NVarChar, user.dn)
								.input('title', sql.NVarChar, user.title)
								.input('team', sql.NVarChar, user.physicalDeliveryOfficeName)
								.input('service', sql.NVarChar, user.description)
								.input('department', sql.NVarChar, user.department)
								.input('username', sql.NVarChar, user.sAMAccountName)
								.input('mail', sql.NVarChar, user.mail)
								.input('manager_dn', sql.NVarChar, user.manager)
								.input('source', sql.NVarChar, 'bilesim_ad')
								.execute('dbo.USERS_ADD_USER');
							// logger.info(result);
						} catch (err: any) {
							logger.error(err);
							const errorDetails: ErrorDetails = {
								code: 'DB_CONNECTION',
								message: 'Veritabanı bağlantı hatası.',
							};
							// throw errorDetails;
						}
					});
				});
			});
		});
	} catch (err: any) {
		logger.error(err);
		const errorDetails: ErrorDetails = {
			code: 'DB_CONNECTION',
			message: err.message,
		};
		throw errorDetails;
	}
}
