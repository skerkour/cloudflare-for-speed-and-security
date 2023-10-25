interface Env {
	api: Fetcher;
}

export const onRequest: PagesFunction<Env> = async (context) => {
	const req = context.request.clone();
	const url = req.url.replace('/api', '/');
	const apiReq = new Request(url, req);

	return context.env.api.fetch(apiReq);
}
