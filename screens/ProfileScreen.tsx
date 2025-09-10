"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native"
import { supabase } from "../lib/supabase"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null)
  const [reviewCount, setReviewCount] = useState(0)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const navigation = useNavigation()

  useEffect(() => {
    getProfile()
    getReviewCount()
    getFavoriteCount()
  }, [])

  async function getProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    } catch (error: any) {
      Alert.alert("Error", error.message)
    }
  }

  async function getReviewCount() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { count, error } = await supabase
          .from("reviews")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        if (error) throw error
        setReviewCount(count || 0)
      }
    } catch (error: any) {
      Alert.alert("Error", error.message)
    }
  }

  async function getFavoriteCount() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { count, error } = await supabase
          .from("favorites")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        if (error) throw error
        setFavoriteCount(count || 0)
      }
    } catch (error: any) {
      Alert.alert("Error", error.message)
    }
  }

  async function signOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.auth.signOut()
          if (error) Alert.alert("Error", error.message)
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#FF6B35" />
        </View>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.memberSince}>
          Member since {user?.created_at ? new Date(user.created_at).getFullYear() : "2024"}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{reviewCount}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{favoriteCount}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Favorites")}>
          <Ionicons name="heart" size={24} color="#FF6B35" />
          <Text style={styles.menuText}>Favorite Restaurants</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="star" size={24} color="#FF6B35" />
          <Text style={styles.menuText}>My Reviews</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings" size={24} color="#FF6B35" />
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle" size={24} color="#FF6B35" />
          <Text style={styles.menuText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Ionicons name="log-out" size={24} color="#fff" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    marginBottom: 15,
  },
  email: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginTop: 10,
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  menuContainer: {
    backgroundColor: "#fff",
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B35",
    margin: 20,
    padding: 15,
    borderRadius: 8,
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
})
