import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";

const Screen01 = ({ route, navigation }) => {
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [categoriesapi, setCategoriesapi] = useState([]);
    const [locationsapi, setLocationsapi] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const { user } = route.params || 'Không tìm thấy user';
    useEffect(() => {
        setCategories([
            { name: 'Resort', image: require('../img/resort.png') },
            { name: 'Homestay', image: require('../img/homestay.png') },
            { name: 'Hotel', image: require('../img/hotel.png') },
            { name: 'Lodge', image: require('../img/lodge.png') },
            { name: 'Villa', image: require('../img/villa.png') },
            { name: 'Apartement', image: require('../img/apartment.png') },
            { name: 'Hostel', image: require('../img/hostel.png') },
            { name: 'See all', image: require('../img/seeall.png') }
        ]);
        setLocations([
            { image: require('../img/photo1.png') },
            { image: require('../img/photo2.png') },
            { image: require('../img/photo3.png') },
            { image: require('../img/photo4.png') },
            { image: require('../img/photo5.png') },
            { image: require('../img/photo1.png') },

        ]);
        axios.get('https://671cab6e09103098807aca53.mockapi.io/dulich/v1/category').then((response) => {
            setCategoriesapi(response.data);
            setFilteredCategories(response.data);
            
        });
        axios.get('https://671cab6e09103098807aca53.mockapi.io/dulich/v1/location').then((response) => {
            setLocationsapi(response.data);
         });
    
    }, []);
    const handleSearch = (text) => {
        setSearch(text); // Cập nhật state search
        const filteredData = categoriesapi.filter(item =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCategories(filteredData); // Cập nhật kết quả tìm kiếm
    };
        
    return (
        <View style={styles.container}>
            <ScrollView >
            <View style={styles.header}>
                <View style={styles.header1}>
                    <Image source={require('../img/logoicon.png')} style={styles.imgHeader} />
                    <View style={styles.inputContainer}>
                        <Image source={require('../img/findicon.png')} style={styles.imgSearch} />
                            <TextInput style={styles.searchBox} placeholder="Search here..."
                                value={search}
                                onChangeText={handleSearch}

                            
                            />

                    </View>

                </View>
                <View style={styles.header2}>
                    
                        <View style={styles.gioiThieu}>
                            <TouchableOpacity onPress={ ()=>navigation.navigate('Profile', {user})}>
                            <Image source={user && user.avatar ? { uri: `http://172.16.32.211:3000/uploads/${user.avatar}`  } : require('../img/personicon.png')} style={styles.imgProfile} />
                            </TouchableOpacity>
                        <View style={styles.title}>
                                <Text style={styles.title1}>Welcome !</Text>
                                <Text style={styles.title2}>{user ? user.username: "Guest"}</Text>
                        </View>
                      
                    </View>
                    <Image source={require('../img/ringicon.png')} style={styles.imgBell} />

                </View>

            </View>
            <View style = {styles.categoryContainer}>
                <View style={styles.categoryHeader}>
                    <Text style = {styles.titlecategory}>Category</Text>
                    <TouchableOpacity>
                        <Image source={require('../img/3gach.png')} style={styles.img3gachCategory} />
                    </TouchableOpacity>

                </View>

                <FlatList
                        data={filteredCategories}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                           
                            <View style={styles.categoryItem}>
                                    <TouchableOpacity>
                                        <Image source={{ uri: item.image }} style={styles.categoryImage} />
                                      

                                        <Text style={styles.catoryText}>{item.name}</Text>
                                    </TouchableOpacity>
                                   
                             </View>

                    )}
                   
                    
                    numColumns={4}
                    contentContainerStyle={styles.contentContainer}
                
                />

                


            </View>
            <View style={styles.popularContainer}>
                <View style={styles.categoryHeader}>
                    <Text style={styles.titlecategory}>Popular Destination</Text>
                    <TouchableOpacity>
                        <Image source={require('../img/3gach.png')} style={styles.img3gachCategory} />
                    </TouchableOpacity>

                </View>

                    <FlatList
                     
                        // data={locations.slice(0,3)}
                     data={locationsapi.slice(0,3)}
                    renderItem={({ item }) => (
                        <View style={styles.locationItem}>
                            <Image source={{ uri: item.image }} style={styles.locationImage} />
                           
                        </View>

                    )}
                    keyExtractor={(item) => item.image}
                    horizontal
                 
                    contentContainerStyle={styles.contentContainer}

                    />
                    
                {/* // Recomended */}

                </View>
                <View style={styles.popularContainer}>
                    <View style={styles.categoryHeader}>
                        <Text style={styles.titlecategory}>Recomended</Text>
                       

                    </View>

                    <FlatList
                        // data={locations.slice(4, 6)}
                        data={locationsapi.slice(4, 6)}
                        renderItem={({ item }) => (
                            <View style={styles.recomendedItem}>
                                <Image source={{ uri: item.image }} style={styles.locationImage} />

                            </View>

                        )}
                        keyExtractor={(item) => item.image}
                        horizontal
                    />
                    

                </View>
            

            </ScrollView>
            <View style={styles.fotter}>
                <View style={styles.fotterItem}>
                    <Image source={require('../img/homeicon.png')} style={styles.fotterImage} />
                    <Text style={styles.fotterText}>Home</Text>
                </View>
                <View style={styles.fotterItem}>
                    <Image source={require('../img/exploreicon.png')} style={styles.fotterImage} />
                    <Text style={styles.fotterText}>Explore</Text>
                </View>
                <View style={styles.fotterItem}>
                    <Image source={require('../img/searchicon.png')} style={styles.fotterImage} />
                    <Text style={styles.fotterText}>Search</Text>
                </View>
                <View style={styles.fotterItem}>
                    <Image source={require('../img/profileicon.png')} style={styles.fotterImage} />
                    <Text style={styles.fotterText}>Profile</Text>
                </View>

            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        color: 'white',

    },
    header: {
        backgroundColor: '#6426ff',
        paddingVertical: 20,
    },
    header1: {
       
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    
    
    imgHeader: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    inputContainer: {
        width: '70%',
        borderWidth: 1,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 20,
        backgroundColor: 'white',
    }, searchBox: {
        paddingVertical: 10,
        paddingLeft: 10,
        width: '100%',
        

    }, imgSearch: {
        position: 'absolute',
        right: 0,
        marginRight: 10,
        alignItems: 'center',
    }, imgProfile: {
        width: 40,
        height: 40,
        borderRadius: 50,
    }, imgBell: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginRight: 40,
    }, header2: {
        marginTop: 20,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        
    }, gioiThieu: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 30,
    }, title: {
        marginLeft: 20,
        color: 'white',
    }, title1: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
    }
    , title2: {
       
        color: 'white',
    }, categoryHeader: {

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 30,
        marginVertical: 20,
    }, img3gachCategory: {
        width: 25,
        height: 25,
    }, titlecategory: {
        fontSize: 18,
    }, categoryItem: {
        marginLeft: 20,
        alignItems: 'center',
        paddingVertical: 10,
        marginLeft: 25,
    }, locationImage: {
        width: 100,
        height: 100,
        borderRadius: 20,
        marginLeft: 20,
    }, recomendedImage:{
        width: 170,
        height: 120,
        borderRadius: 10,
        marginLeft: 15,
    }, fotter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#6426ff',
        paddingVertical: 40,
        width: '100%',
        
    }, fotterImage: {
        width: 40,
        height: 40,
    }, fotterText: {
        color: 'white',
    }, categoryImage: {
        
        width: 65,
        height: 65,
        
    }, catoryText: {
        marginLeft: 10,
    }


});
export default Screen01;
