import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';

interface User {
  id: number;
  email: string;
}
interface Comment {
  id: number;
  content: string;
  user?: User;
}
interface Thread {
  id: number;
  title: string;
  content: string;
  user?: User;
  comments: Comment[];
}

export default function ForumScreen() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Fetch auth token on mount
  useEffect(() => {
    (async () => {
      const jwt = await SecureStore.getItemAsync('token');
      setToken(jwt);
    })();
  }, []);

  // Fetch threads on mount or refresh
  async function fetchThreads() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/threads`);
      if (!res.ok) throw new Error('Failed to load threads');
      const data = await res.json();
      setThreads(data);
      // Refresh selectedThread if open
      if (selectedThread) {
        const updated = data.find((t: Thread) => t.id === selectedThread.id);
        setSelectedThread(updated || null);
      }
    } catch (err: any) {
      setError(err.message || 'Could not fetch threads');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create a new thread
  async function handleAddThread() {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;
    if (!token) {
      Alert.alert('You must be logged in to post.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/threads`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newThreadTitle, content: newThreadContent }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create thread');
      }
      setNewThreadTitle('');
      setNewThreadContent('');
      await fetchThreads();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create thread');
    } finally {
      setSubmitting(false);
    }
  }

  // Add a comment to a thread
  async function handleAddComment() {
    if (!selectedThread || !newComment.trim()) return;
    if (!token) {
      Alert.alert('You must be logged in to comment.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/threads/${selectedThread.id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add comment');
      }
      setNewComment('');
      await fetchThreads();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  }

  function handleSelectThread(thread: Thread) {
    setSelectedThread(thread);
    setNewComment('');
  }

  function handleBack() {
    setSelectedThread(null);
    setError('');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Forum</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : selectedThread ? (
          <View style={{ flex: 1, width: "100%" }}>
            <TouchableOpacity onPress={handleBack}>
              <Text style={styles.backButton}>← Back to threads</Text>
            </TouchableOpacity>
            <Text style={styles.threadTitle}>{selectedThread.title}</Text>
            {selectedThread.user && (
              <Text style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
                By {selectedThread.user.email}
              </Text>
            )}
            <Text style={{ marginBottom: 12 }}>{selectedThread.content}</Text>
            <Text style={{ fontWeight: "bold", marginBottom: 6 }}>Comments:</Text>
            <FlatList
              data={selectedThread.comments}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.commentBox}>
                  <Text>
                    {item.content}
                    <Text style={{ color: "#aaa", fontSize: 12 }}>
                      {" "}– {item.user?.email ?? "Anonymous"}
                    </Text>
                  </Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={{ color: "#888", fontStyle: "italic" }}>
                  No comments yet.
                </Text>
              }
              style={{ maxHeight: 160 }}
            />
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TextInput
                style={styles.input}
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity style={styles.button} onPress={handleAddComment} disabled={submitting}>
                <Text style={styles.buttonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, width: "100%" }}>
            <Text style={{ fontWeight: "bold", marginBottom: 6 }}>Start a new thread:</Text>
            <TextInput
              style={styles.input}
              placeholder="Thread Title"
              value={newThreadTitle}
              onChangeText={setNewThreadTitle}
            />
            <TextInput
              style={[styles.input, { marginBottom: 10 }]}
              placeholder="Content"
              value={newThreadContent}
              onChangeText={setNewThreadContent}
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleAddThread} disabled={submitting}>
              <Text style={styles.buttonText}>Create Thread</Text>
            </TouchableOpacity>
            <Text style={{ fontWeight: "bold", marginVertical: 12 }}>Threads:</Text>
            <FlatList
              data={threads}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.threadBox}
                  onPress={() => handleSelectThread(item)}
                >
                  <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
                  <Text numberOfLines={2} style={{ color: "#666" }}>
                    {item.content}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#888" }}>
                    By {item.user?.email ?? "Anonymous"}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>
                    {item.comments.length} comment{item.comments.length !== 1 ? "s" : ""}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={{ color: "#888", fontStyle: "italic" }}>
                  No threads yet. Start one above!
                </Text>
              }
            />
          </View>
        )}
        {error ? <Text style={{ color: 'red', marginTop: 16 }}>{error}</Text> : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 16,
  },
  threadTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 10,
  },
  backButton: {
    color: "#4A90E2",
    marginBottom: 8,
    fontSize: 16,
  },
  threadBox: {
    backgroundColor: "#f4f7fa",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  commentBox: {
    backgroundColor: "#e7eaf0",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    minWidth: 0,
  },
  button: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginLeft: 6,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
