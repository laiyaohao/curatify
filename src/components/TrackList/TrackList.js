import React from 'react';
import Track from '../Track/Track';
import './TrackList.css';

class TrackList extends React.Component {
    
    render() {
        // while it is still a promise, do nothing
        // if (this.props.tracks instanceof Promise) {
        //     setTimeout(() => {
                
        //     }, 3000);
        // }
        // else {
        //     console.log("not a promise")
        // }
        console.log(this.props.tracks)
        // now its not a promise, return the track
        return (
            <div className="TrackList">
                {this.props.tracks && this.props.tracks.length && this.props.tracks.map(
                    track =>{
                        return (
                            <Track key = {track.id} 
                            track = {track}
                            onAdd = {this.props.onAdd}
                            onRemove = {this.props.onRemove}
                            isRemoval = {this.props.isRemoval}/>
                        )
                    }
                )
                }
                
            </div>
        )
    }
}
export default TrackList;