"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from "react-native-maps"
import * as Location from "expo-location"
import { supabase } from "../lib/supabase"
import { Ionicons } from "@expo/vector-icons"

interface Restaurant {
  id: string
  name: string
  cuisine_type: string
  address: string
  rating: number
  image_url: string
  latitude: number
  longitude: number
}

const { width, height } = Dimensions.get("window")

export default function MapScreen({ navigation }: any) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [locationPermission, setLocationPermission] = useState<boolean>(false)
  const [region, setRegion] = useState<Region>({
    latitude: 40.7128,
    longitude: -74.006,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    fetchRestaurants()
    requestLocationPermission()
  }, [])

  async function requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === "granted") {
        setLocationPermission(true)
        getCurrentLocation()
      } else {
        setLocationPermission(false)
        Alert.alert(
          "Location Permission",
          "Location access was denied. You can still view restaurants on the map, but we won't be able to show your current location.",
          [{ text: "OK" }],
        )
      }
    } catch (error) {
      console.error("Error requesting location permission:", error)
    }
  }

  async function getCurrentLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
      setUserLocation(userCoords)

      // Center map on user location
      const newRegion = {
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
      setRegion(newRegion)
      mapRef.current?.animateToRegion(newRegion, 1000)
    } catch (error) {
      console.error("Error getting current location:", error)
    }
  }

  async function fetchRestaurants() {
    try {
      const { data, error } = await supabase.from("restaurants").select("*").order("rating", { ascending: false })

      if (error) throw error
      setRestaurants(data || [])
    } catch (error: any) {
      Alert.alert("Error", error.message)
    }
  }

  const onRestaurantPress = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    const newRegion = {
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
    mapRef.current?.animateToRegion(newRegion, 1000)
  }

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      const newRegion = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
      setRegion(newRegion)
      mapRef.current.animateToRegion(newRegion, 1000)
    } else if (!locationPermission) {
      Alert.alert("Location Required", "Please enable location permissions to use this feature.", [
        { text: "Cancel", style: "cancel" },
        { text: "Settings", onPress: () => requestLocationPermission() },
      ])
    }
  }

  const renderRestaurantMarkers = () => {
    return restaurants.map((restaurant) => (
      <Marker
        key={restaurant.id}
        coordinate={{
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
        }}
        title={restaurant.name}
        description={`${restaurant.cuisine_type} • ${restaurant.rating}⭐`}
        onPress={() => onRestaurantPress(restaurant)}
      >
        <View style={styles.markerContainer}>
          <View style={styles.marker}>
            <Ionicons name="restaurant" size={20} color="#fff" />
          </View>
        </View>
      </Marker>
    ))
  }

  const renderUserLocationMarker = () => {
    if (!userLocation) return null

    return (
      <Marker coordinate={userLocation} title="Your Location" description="You are here" anchor={{ x: 0.5, y: 0.5 }}>
        <View style={styles.userLocationMarker}>
          <View style={styles.userLocationDot} />
        </View>
      </Marker>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        {renderRestaurantMarkers()}
        {renderUserLocationMarker()}
      </MapView>

      {/* Control buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={centerOnUser}>
          <Ionicons name="locate" size={24} color="#FF6B35" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={() => navigation.navigate("Restaurants")}>
          <Ionicons name="list" size={24} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      {/* Restaurant info card */}
      {selectedRestaurant && (
        <View style={styles.restaurantCard}>
          <TouchableOpacity
            style={styles.cardContent}
            onPress={() => navigation.navigate("RestaurantDetail", { restaurant: selectedRestaurant })}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{selectedRestaurant.name}</Text>
              <Text style={styles.cardCuisine}>{selectedRestaurant.cuisine_type}</Text>
              <Text style={styles.cardAddress}>{selectedRestaurant.address}</Text>
              <View style={styles.cardRating}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{selectedRestaurant.rating}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedRestaurant(null)}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}

      {/* Location permission banner */}
      {!locationPermission && (
        <View style={styles.permissionBanner}>
          <Text style={styles.permissionText}>Enable location for better restaurant suggestions</Text>
          <TouchableOpacity style={styles.enableButton} onPress={requestLocationPermission}>
            <Text style={styles.enableButtonText}>Enable</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    backgroundColor: "#FF6B35",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0, 122, 255, 0.3)",
    borderWidth: 2,
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  userLocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
  },
  controlsContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    gap: 10,
  },
  controlButton: {
    backgroundColor: "#fff",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardCuisine: {
    fontSize: 14,
    color: "#FF6B35",
    marginBottom: 4,
  },
  cardAddress: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  cardRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  closeButton: {
    padding: 8,
  },
  permissionBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    paddingTop: 50,
  },
  permissionText: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
  },
  enableButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  enableButtonText: {
    color: "#FF6B35",
    fontSize: 14,
    fontWeight: "bold",
  },
})
