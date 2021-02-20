//import logo from './logo.svg';
import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from "../../util/Spotify";

class App extends React.Component {
  	constructor(props) {
		super(props);
		this.state = {
			searchResults: [],
			playlistName: "",
			playlistTracks: []
		}
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
	}
	addTrack(track) {
		if (this.state.playlistTracks.find(savedTrack => (savedTrack.id === track.id ))) {
			return;
		}
		else {
			this.state.playlistTracks.push(track);
			this.setState({playlistTracks: this.state.playlistTracks})
		}
	}
	removeTrack(track) {
		let afterPlaylistTracks = this.state.playlistTracks.filter(playlistTrack => (playlistTrack.id !== track.id))
		this.setState({playlistTracks : afterPlaylistTracks})
	}
	updatePlaylistName(name) {
		this.setState({playlistName: name})
	}
	savePlaylist(){
		let tracksUri = this.state.playlistTracks.map(track => track.uri);
		console.log(tracksUri)
		Spotify.savePlaylist(this.state.playlistName,tracksUri)
	}
	async search(term) {
		// console.log("haha")
		
		if (term) {
			Spotify.getAccessToken();
			let searchResult = await Spotify.search(term);
		// await is important, because without it, it will be a promise, which we will
		// run into errors when we try to use .map() on promise
		// to use await, the function needs to be converted to a async function, using the async keyword at
		// the start of the function
			this.setState({searchResults: searchResult})
		// console.log(searchResult)
		}
		
	}
	render() {
		return (
			<div>
			<h1>Curatify</h1>
			<div className="App">
				<SearchBar onSearch = {this.search}/>
				<div className="App-playlist">
					<SearchResults searchResults = {this.state.searchResults}
					onAdd = {this.addTrack}/>
					<Playlist playlistName = {this.state.playlistName} 
					playlistTracks = {this.state.playlistTracks}
					onRemove = {this.removeTrack}
					onNameChange = {this.updatePlaylistName}
					onSave = {this.savePlaylist}/>
				</div>
			</div>
			</div>
		)
	}
	
}

export default App;
