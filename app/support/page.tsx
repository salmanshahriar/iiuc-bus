import { Card, CardContent } from "@/components/ui/card";
import { Phone, FileText, User, MessageCircle, Code } from "lucide-react";
import Image from "next/image";

export default function SupportPage() {
  return (
    <div className="container max-w-full mx-auto p-4 md:p-6 mb-20 md:mb-0">
      <div className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-[var(--primary-color)] flex items-center gap-2">
          <MessageCircle className="h-8 w-8" />
          Support
        </h1>
        <p className="text-muted-foreground mt-2">Contact information and guidelines</p>
      </div>

      <div className="space-y-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[var(--primary-color)] mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Transport Director
                </h2>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>Mohammad Ariful Islam</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="text-muted-foreground">Phone:</span>
                    <a href="tel:+880-1234567890" className="text-[var(--primary-color)] hover:underline flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      +880-1234567890
                    </a>
                  </p>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[var(--primary-color)] mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Supervisor
                </h2>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>Mohammad Shahed Alam</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="text-muted-foreground">Phone:</span>
                    <a href="tel:+880-1234567891" className="text-[var(--primary-color)] hover:underline flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      +880-1234567891
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-[var(--primary-color)] mb-4 flex items-center gap-2">
              <Code className="h-5 w-5" />
              Developer Info
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { name: "Salman Shahriar", role: "Frontend", initials: "SS" },
                { name: "MD. Saiful Chowdhury", role: "Backend", initials: "MSC" },
                { name: "Jane Doe", role: "UI/UX", initials: "JD" },
                { name: "John Smith", role: "Full Stack", initials: "JS" },
                { name: "Alice Johnson", role: "QA", initials: "AJ" },
              ].map((dev, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="relative w-16 h-16 mb-2 overflow-hidden rounded-full border border-[var(--primary-color)]">
                    <Image
                      src={`/placeholder.svg?height=64&width=64&text=${dev.initials}`}
                      alt={dev.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <h3 className="text-sm font-medium">{dev.name}</h3>
                  <p className="text-xs text-muted-foreground">{dev.role}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-[var(--primary-color)] mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              User Guidelines
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Report any issues to the transport director</li>
              <li>Keep your profile information up to date</li>
              <li>Follow the bus rules and regulations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
