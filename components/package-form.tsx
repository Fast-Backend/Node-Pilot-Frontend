"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Checkbox } from "./ui/checkbox"


const FormSchema = z.object({
    name: z.string().min(2, {
        message: "project name must be at least 2 characters.",
    }),
    version: z.string().optional(),
    description: z.string().optional(),
    main: z.string().optional(),
    test: z.string().optional(),
    git: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    author: z.string().optional(),
    license: z.string().optional(),
});

type FormType = z.infer<typeof FormSchema>;

const defaultValues: FormType = {
    name: "",
    author: "",
    version: "1.0.0",
    description: "",
    git: "",
    keywords: [],
    license: "ISC",
    main: "index",
    test: ""
}

export default function PackageForm() {

    const { register,
        handleSubmit,
        formState: { errors }, } = useForm<FormType>({
            resolver: zodResolver(FormSchema),
            defaultValues: defaultValues,
        })

    const [keywords, setKeywords] = useState<string[]>([])
    const [keywordInput, setKeywordInput] = useState("")
    const [typescript, setTypescript] = useState(false);

    const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const trimmedKeyword = keywordInput.trim()
            if (trimmedKeyword && !keywords.includes(trimmedKeyword)) {
                setKeywords([...keywords, trimmedKeyword])
                setKeywordInput("")
            }
        }
    }


    const removeKeyword = (keywordToRemove: string) => {
        setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove))
    }
    const onSubmit = (data: FormType) => {
        // Transform keywords array to simple string array
        if (data.main?.includes(".")) {
            const pos = data.main.indexOf(".");
            data.main = data.main.slice(0, pos);
        }
        const formattedData = {
            ...data,
            keywords: keywords,
            main: typescript ? data.main + ".ts" : data.main + "js"
        }
        console.log("Form submitted successfully:", formattedData)
        console.log(typescript);
        // Handle form submission here
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Package Information</CardTitle>
                <CardDescription>Fill out the details for your package configuration.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                placeholder="Enter package name"
                                {...register("name")}
                                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="entry-point">Entry Point</Label>
                            <Input id="entry-point" placeholder="index.js" defaultValue="index.js" {...register("main")} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="version">Version</Label>
                            <Input id="version" {...register("version")} placeholder="1.0.0" defaultValue="1.0.0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="author">Author</Label>
                            <Input id="author" {...register("author")} placeholder="Enter author name" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords</Label>
                        <div className="space-y-2">
                            <Input
                                id="keywords"
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyDown={handleKeywordKeyDown}
                                placeholder="Type a keyword and press Enter"
                            />
                            {keywords.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {keywords.map((keyword, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            {keyword}
                                            <button
                                                type="button"
                                                onClick={() => removeKeyword(keyword)}
                                                className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="git-url">Git URL</Label>
                            <Input id="git-url" {...register("git")} type="url" placeholder="https://github.com/username/repo" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="test-command">Test Command</Label>
                            <Input id="test-command" {...register("test")} placeholder="npm test" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Enter package description"
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="flex justify-between">

                        <div className="flex space-x-2">
                            <Checkbox id="ts" onClick={() => {
                                setTypescript((prev) => {
                                    return !prev
                                })
                            }} checked={typescript} />

                            <label
                                htmlFor="ts"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Click to use Typescript setup
                            </label>
                        </div>
                        <Button type="submit" className="w-full md:w-auto">
                            Create Package
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
