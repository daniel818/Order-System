import React from 'react';
import AddFishForm from './AddFishForm'
import base from '../base';


class Inventory extends React.Component {

    constructor() {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.authHandler = this.authHandler.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            uid: null,
            owner: null
        }
    }

    componentDidMount(){
      base.onAuth((user)=>{
        if(user) {
            this.authHandler(null, {user});
        }
      })
    }

    handleChange(e,key){
        const fish = this.props.fishes[key];

        const updatedFish = {
            ...fish,
            [e.target.name] : e.target.value
        };

        this.props.updateFish(key, updatedFish );

    }

    renderInventory(key) {
        const fish = this.props.fishes[key];

    return(
        <div className="fish-edit">
          <input type="text"  name="name" value={fish.name} placeholder="Fish Name"
                 onChange={(e) => this.handleChange(e,key)} />

          <input type="text"  name="price" value={fish.price} placeholder="Fish Price"
                 onChange={(e) => this.handleChange(e,key)}/>

          <select type="text" name="status" value={fish.status}
                  onChange={(e) => this.handleChange(e,key)}>
            <option value="available">Fresh!</option>
            <option value="unavailable">Sold Out!</option>
          </select>

          <textarea type="text"  name="desc" value={fish.desc} placeholder="Fish Desc"
                    onChange={(e) => this.handleChange(e,key)}/>

          <input type="text"  name="image" value={fish.image} placeholder="Fish Image"
                 onChange={(e) => this.handleChange(e,key)} />
          <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
        </div>
    )
  }

    renderLogin(){
      return(
          <nav className="login">
            <h2>Inventory</h2>
            <button className="facebook" onClick={()=> this.authenticate('facebook')}>Log in Facebook</button>
            <button className="github" onClick={()=> this.authenticate('github')}>Log in Github</button>
          </nav>
      )

    }

    logout(){
      base.unauth();
      this.setState({uid: null});
    }
    authenticate(provider){
      base.authWithOAuthPopup(provider,this.authHandler);
    }


    authHandler(err, authData) {
      console.log(authData);
        if (err) {
            console.log(err);
            return;
        }

        const storeRef = base.database().ref(this.props.storeId);

        storeRef.once('value',(snapshot) =>{
          const data = snapshot.val() ||{};

          if(!data.owner){
            storeRef.set({
                owner:authData.user.uid
            })
          }

          this.setState({
              uid: authData.user.uid,
              owner: data.owner || authData.user.uid
          })
        })
    }
render() {

    const logOut = <button onClick={this.logout}>Log out</button>

      if(!this.state.uid){
        return <div>{this.renderLogin()}</div>
      }

      //if you arent owner

      if(this.state.uid !== this.state.owner){
        return(<div>
          <p> Sorry you are not the owner </p>
            {logOut}
        </div>)
      }

    return (
       <div>
         <h2>Inventory</h2>
           {logOut }
           {Object.keys(this.props.fishes).map(this.renderInventory)}
         <AddFishForm addFish={this.props.addFish}/>
         <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
       </div>

    )
  }
}

export default Inventory;
