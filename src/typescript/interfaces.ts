import type { Request } from "express";

export interface IRequest extends Request {
	user: {
		id: string;
		permissions: string[]
	}
}

export interface IMetaGetUsers {
	limit: string;
	maxPerPage: string;
	page: string;
}