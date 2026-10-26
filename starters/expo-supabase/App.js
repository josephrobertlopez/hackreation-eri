import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import sample from './data/job_postings.json';
import { supabase } from './lib/supabase';

export default function App() {
  const [jobs, setJobs] = useState(sample);
  const [source, setSource] = useState('bundled sample data');
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.from('job_postings').select('*').limit(100).then(({ data, error }) => {
      if (error) setSource(`Supabase error: ${error.message} (showing sample data)`);
      else { setJobs(data); setSource('Supabase'); }
    });
  }, []);

  const hits = useMemo(() => jobs.filter(j =>
    `${j.title} ${j.neighborhood} ${j.category}`.toLowerCase().includes(q.toLowerCase())), [jobs, q]);

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.root}>
      <Text style={styles.h1} accessibilityRole="header">Hello, ERI!</Text>
      <Text style={styles.muted}>Expo + Supabase starter · data: {source}</Text>
      <TextInput
        style={styles.input}
        value={q}
        onChangeText={setQ}
        placeholder="Search jobs, e.g. cook"
        accessibilityLabel="Search sample jobs"
      />
      <Text accessibilityLiveRegion="polite" style={styles.muted}>{hits.length} of {jobs.length} jobs</Text>
      <FlatList
        data={hits}
        keyExtractor={j => j.posting_id}
        renderItem={({ item: j }) => (
          <View style={styles.row} accessible accessibilityLabel={`${j.title} at ${j.employer}, ${j.neighborhood}, ${j.hours_per_week} hours a week, ${j.wage_per_hour} dollars an hour`}>
            <Text style={styles.title}>{j.title}</Text>
            <Text style={styles.muted}>{j.employer} · {j.neighborhood} · {j.hours_per_week} h/wk · ${j.wage_per_hour}/h</Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: '#fff' },
  h1: { fontSize: 28, fontWeight: '700', marginTop: 24 },
  muted: { color: '#444', fontSize: 16, marginVertical: 4 },
  input: { borderWidth: 2, borderColor: '#555', borderRadius: 8, padding: 12, fontSize: 18, marginVertical: 12, minHeight: 48 },
  row: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#ccc', minHeight: 48 },
  title: { fontSize: 18, fontWeight: '600' },
});
