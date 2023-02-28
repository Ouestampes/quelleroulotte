// Compact arrays with null entries; delete keys from objects with null value
export function removeNulls<NObject>(obj: NObject): NObject {
	let obj2: any;
	if (obj instanceof Array) {
		obj2 = obj.filter(el => el !== null);
	} else {
		obj2 = obj;
	}
	for (const k in obj2) {
		if (typeof obj2[k] === 'object') {
			obj2[k] = removeNulls(obj2[k]);
		}
	}
	return obj2;
}
