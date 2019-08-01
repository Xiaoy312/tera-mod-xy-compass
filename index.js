'use strict';

module.exports = function GatheringCompass(mod) {
	this.StateTracker = mod.require.CaaliStateTracker;

	const IdMod = 2n;
	const MarkerId = 98260;

	let settings = mod.settings;
	let markers = [];

	mod.hook('S_LOAD_TOPO', 3, event => {
		mod.log(`S_LOAD_TOPO: ${event.zone} @ ${event.loc}`);
		markers = [];
	})

	mod.hook('S_SPAWN_COLLECTION', 4, event => {
		mod.log(`S_SPAWN_COLLECTION: ${event.gameId}: ${event.id} ${event.amount}x ${event.loc}`);
		addMarker(event.gameId, event.loc);
	})
	mod.hook('S_DESPAWN_COLLECTION', 2, event => {
		removeMarker(event.gameId);
	})

	function addMarker(id, loc) {
		loc.z -= 100;

		let marker = {
			gameId: id * IdMod,
			loc: loc,
			item: MarkerId,
			amount: 1,
			expiry: 300000,
			explode: false,
			masterwork: false,
			enchant: 0,
			source: 0,
			debug: false,
			owners: [{ id: 0 }]
		}
		mod.send('S_SPAWN_DROPITEM', 7, marker);
		markers.push(id.toString());
	}
	function removeMarker(id) {
		if (!markers.includes(id.toString())) return;

		mod.send('S_DESPAWN_DROPITEM', 4, { gameId: id * IdMod });
		markers.splice(markers.indexOf(id.toString()), 1);
	}
}