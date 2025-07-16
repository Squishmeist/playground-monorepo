import { SafeAreaView, Text, View } from "react-native";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { trpc } from "~/utils/api";

export default function Post() {
  const { id } = useGlobalSearchParams();
  if (!id || typeof id !== "string") throw new Error("unreachable");
  const { data } = useQuery(trpc.auth.externalUsers.queryOptions());

  if (!data) return;

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "External" }} />
      <View className="h-full w-full p-4">
        {data.map((user) => (
          <View key={user.id} className="mb-4 rounded-lg bg-white p-4 shadow">
            <Text className="text-lg font-bold">{user.name}</Text>
            <Text className="text-gray-600">{user.role}</Text>
            <Text className="text-gray-500">{user.type}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
