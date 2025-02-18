import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowRight, Users, Waves } from "lucide-react";
import Header from "@/components/header";

export default function Home() {
  return (
    <div>
      <Header title="Chat History Dashboard" />
      <main className="container mx-auto p-4 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Link
            href="/chat/namami-gange"
            className="block transition-transform hover:scale-105"
          >
            <Card className="h-full cursor-pointer hover:border-green-400">
              <CardHeader className="flex flex-col items-center text-center p-6">
                <div className="p-3 bg-green-100 rounded-full mb-4">
                  <Waves className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl mb-2">
                  Namami Gange Programme
                </CardTitle>
                <CardDescription className="text-base">
                  View chat histories related to the Namami Gange Programme and
                  river conservation efforts
                </CardDescription>
                <div className="mt-4 flex items-center text-green-600">
                  View Chats <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link
            href="/chat/citizen-reporting"
            className="block transition-transform hover:scale-105"
          >
            <Card className="h-full cursor-pointer hover:border-purple-400">
              <CardHeader className="flex flex-col items-center text-center p-6">
                <div className="p-3 bg-purple-100 rounded-full mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl mb-2">
                  Citizen Reporting
                </CardTitle>
                <CardDescription className="text-base">
                  Access chat histories for citizen reports and community
                  engagement
                </CardDescription>
                <div className="mt-4 flex items-center text-purple-600">
                  View Chats <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link
            href="/chat/solix"
            className="block transition-transform hover:scale-105"
          >
            <Card className="h-full cursor-pointer hover:border-red-400">
              <CardHeader className="flex flex-col items-center text-center p-6">
                <div className="p-3 bg-red-100 rounded-full mb-4">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl mb-2">
                  Solix Chatbot
                </CardTitle>
                <CardDescription className="text-base">
                  Access chat histories for solix chatbot
                </CardDescription>
                <div className="mt-4 flex items-center text-red-600">
                  View Chats <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
