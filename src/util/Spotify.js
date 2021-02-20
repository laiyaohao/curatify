import CLIENT_ID from './secret';

let token = '';

let REDIRECT_URI = 'http://localhost:3000/';
const Spotify = {
    getAccessToken() {
        if (token !== '') {
            return
        }
        const access = window.location.href.match(/access_token=([^&]*)/)
        const expires = window.location.href.match(/expires_in=([^&]*)/)
        if (access && expires) {
            token = access[1];
            const expires_in = Number(expires[1]);
            window.setTimeout(() => (token = ''),expires_in *1000)
            window.history.pushState('Access Token',null,'/')
            return token;
        } else {
            let url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
            window.location = url;
        }
        console.log(token)
    },
    
    search(TERM) {
        let spotifyTracks = fetch(
            `https://api.spotify.com/v1/search?type=track&q=${TERM}`,{
                headers: {Authorization: `Bearer ${token}`},
            }
        )
        // console.log("this is response: ", response)
            // converting the response to json format
        .then(response => response.json())
        .then (
            jsonResponse => {
                // if jsonResponse is empty, return empty array
                if (!jsonResponse) {
                    return [{}]
                }
                // console.log(jsonResponse)
                // else, get each item in jsonResponse and map their attributes to
                // relevant keys
                let tracks = jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }))
                // console.log(tracks)
                return tracks;
            }
        ).catch(error => {
            console.log("Spotify search error")
        })
        // return the tracks array
        return spotifyTracks;
    },

    async savePlaylist(name,trackUris) {
        if (!(name&&trackUris)) {
            return;
        }
        const accessT = token;
        // const headers = ;
        // getting the user id, converting the response to json
        const userID = await fetch(
            `https://api.spotify.com/v1/me`,
            {headers: {
                Authorization: `Bearer ${accessT}`
            },})
            .then (
                response => {return response.json()}
                // with the {} brackets, it is important to put return inside!
                )
            .then(
                jsonResponse => jsonResponse.id
            );
            
        const playlistID = await fetch(
            `https://api.spotify.com/v1/users/${userID}/playlists/`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessT}`,
                    "Content-Type": "application/json"
            },
                body: JSON.stringify({
                    name: name
                }),
                json:true
            }
        ).then(
            response => response.json()
        ).then(
            jsonResponse=> jsonResponse.id
        );
        console.log(userID);
        console.log(playlistID);
        await fetch (
            `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks/`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessT}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    uris: trackUris
                }),
                json:true
            }
        )
    }
};
export default Spotify;