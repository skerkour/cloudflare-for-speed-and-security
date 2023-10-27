interface Env {
	api: Fetcher;
}

export const onRequest: PagesFunction<Env> = async (context) => {
	const url = context.request.url.replace('/api/', '/');
	const apiReq = new Request(url, context.request);

	return context.env.api.fetch(apiReq);
}
