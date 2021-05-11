import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar,
    TextInput, 
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Dimensions,
    AsyncStorage,
    PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HandleBack from './BackHandler';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

export default class Login extends Component{

    constructor(){
      super()
      this.state = {
        showPass: true,
        press: false,
        name: "",
        pass: "",
        genDB: null,
        valDB: null,
        ticketDB: null,
      }
    }

    componentDidMount(){
      this.setState({
        genDB:this.props.navigation.state.params.genRef, 
        valDB: this.props.navigation.state.params.valRef,
        ticketDB: this.props.navigation.state.params.ticketRef
      });
    }

    getData=()=>{
      const {name,pass,genDB,valDB,ticketDB} = this.state;
      const { navigate } = this.props.navigation;
      const userInitial = name[0];
      if(userInitial == 'G'){
        genDB.find({'username':name}, async function (err, doc) {
          if(doc[0] != null){
            var genDoc = doc[0];
            if(genDoc.username==name && genDoc.password==pass){
              await AsyncStorage.setItem("type", JSON.stringify('generator'));
              await AsyncStorage.setItem("username", JSON.stringify(genDoc.username));
              await AsyncStorage.setItem("name", JSON.stringify(genDoc.name));
              await AsyncStorage.setItem("password", JSON.stringify(genDoc.password));
              navigate('GenDashboard', {username: JSON.stringify(genDoc.username), name: JSON.stringify(genDoc.name), 'genRef':genDB, 'valRef':valDB, 'ticketRef': ticketDB});
            }else{
              alert("Invalid Credentials");
            }
          }else{
            alert("Invalid Credentials");
          }
        });
      }else if(userInitial == 'V'){
        valDB.find({'username':name}, async function (err, doc) {
          if(doc[0] != null){
            var valDoc = doc[0];
            if(valDoc.username==name && valDoc.password==pass){
              await AsyncStorage.setItem("type", JSON.stringify('validator'));
              await AsyncStorage.setItem("username", JSON.stringify(valDoc.username));
              await AsyncStorage.setItem("name", JSON.stringify(valDoc.name));
              await AsyncStorage.setItem("password", JSON.stringify(valDoc.password));
              navigate('ValDashboard', {username: JSON.stringify(valDoc.username), name: JSON.stringify(valDoc.name), 'genRef':genDB, 'valRef':valDB, 'ticketRef': ticketDB});
            }else{
              alert("Invalid Credentials");
            }
          }else{
            alert("Invalid Credentials");
          }
        });
      }else{
        alert("Invalid Credentials, You don't have account!")
      }
    }

    showPass = () =>{
      if(this.state.press == false){
        this.setState({showPass: false, press: true})
      }else{
        this.setState({showPass: true, press: false})
      }
    }

    componentDidUpdate(){
      if(this.state.name.length>4){
        this.nameInput.blur();
        this.passwordInput.focus();
      }
    }

    onBack = () => {
      if (true) {
        return true;
      }
    };
    
    render(){
        return(
        <HandleBack onBack={this.onBack}>
        <DismissKeyboard>
        <View style={styles.container}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : null}>
              <ScrollView>
                <StatusBar hidden={true} />
                <View style={styles.box}>
                    <Image
                        style={styles.logo}
                        source={require('./../assets/images/affLogo.png')}
                    />
                    <Text style={styles.title}>AFF E-Ticket Login</Text>
                <View style={styles.inputContainer}>
                      <TextInput 
                        style={styles.username}
                        placeholder="Username"
                        placeholderTextColor='rgba(0,128,0,0.6)'
                        autoCapitalize='characters'
                        autoCorrect={false}
                        maxLength={11}
                        returnKeyType='next'
                        ref={(input) => this.nameInput = input}
                        onSubmitEditing={() => this.passwordInput.focus()}
                        onChangeText = {name=>this.setState({name})}
                      />
                      <Icon name={'ios-contact'} size={SCREEN_HEIGHT * 0.035} color='red' style={styles.usernameIcon} />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput 
                    style={styles.password}
                    secureTextEntry={this.state.showPass}
                    placeholder="Password"
                    placeholderTextColor='rgba(0,128,0,0.6)'
                    returnKeyType='go'
                    maxLength={10}
                    ref={(input) => this.passwordInput = input}
                    onChangeText = {pass=>this.setState({pass})}
                  />
                  <Icon name={'ios-lock'} size={SCREEN_HEIGHT * 0.035} color='red' style={styles.passwordIcon} />
                  <TouchableOpacity 
                        style={styles.passwordEye} 
                        onPress={this.showPass.bind(this)}>
                    <Icon name={this.state.press == false ? 'ios-eye' : 'ios-eye-off'} size={SCREEN_HEIGHT * 0.035} color='red'></Icon>
                  </TouchableOpacity>

                <View>
                  <TouchableOpacity style={styles.loginBtn} onPress={this.getData}>
                    <Text style={styles.loginText}>Login</Text>
                  </TouchableOpacity> 
                </View>
                </View>
                </View>
                </ScrollView>
            </KeyboardAvoidingView>
            </View>
        </DismissKeyboard>
        </HandleBack>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495e',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  box: {
    alignItems : 'center',
    flexGrow: 1,
    marginTop: SCREEN_HEIGHT * 0.12,
  },
  logo: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.3,
  }, 
  title: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: 'bold',
    marginBottom: SCREEN_HEIGHT * 0.1,
  },
  inputContainer: {
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  username: {
    marginTop: SCREEN_HEIGHT * 0.022,
    marginHorizontal: SCREEN_WIDTH * 0.07,
    paddingLeft: SCREEN_WIDTH * 0.14,
    paddingRight: SCREEN_WIDTH * 0.2,
    color: '#008000',
    alignSelf: 'center',
    backgroundColor: 'white',
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.07,
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    borderRadius: SCREEN_WIDTH * 0.09,
  },
  usernameIcon: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.038,
    left: SCREEN_WIDTH * 0.11
  },
  password: {
    marginTop: SCREEN_HEIGHT * 0.022,
    marginHorizontal: SCREEN_WIDTH * 0.07,
    paddingLeft: SCREEN_WIDTH * 0.14,
    paddingRight: SCREEN_WIDTH * 0.2,
    backgroundColor: 'white',
    color: '#008000',
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.07,
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    borderRadius: SCREEN_WIDTH * 0.09,
  },
  passwordIcon: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.038,
    left: SCREEN_WIDTH * 0.11
  },
  passwordEye: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.038,
    right: SCREEN_WIDTH * 0.12
  },
  loginBtn: {
    marginTop: SCREEN_HEIGHT * 0.04,
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.065,
    borderRadius: SCREEN_WIDTH * 0.09,
    alignSelf: 'center',
    backgroundColor: 'red',
  },
  loginText: {
    fontSize: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.065,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: SCREEN_HEIGHT * 0.01,
  },
});

AppRegistry.registerComponent('Login', ()=> Login);