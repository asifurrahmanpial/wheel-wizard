interface GeoJSONFeature {
	type: string;
	properties: any;
	geometry: {
		type: string;
		coordinates: number[][];
	};
}

interface GeoJSONCollection {
	type: string;
	features: GeoJSONFeature[];
}
