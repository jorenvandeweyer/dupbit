<template>
    <div class="w-full md:w-3/4 lg:w-2/3 pt-20 mx-auto">
        <h1 class="text-4xl uppercase font-medium">Snitch</h1>

        <div class="flex justify-center flex-wrap">
            <a class="m-1" href="https://discordbots.org/bot/452042500828299264"><img src="https://discordbots.org/api/widget/status/452042500828299264.svg" alt="Discord Bots" /></a>
            <a class="m-1" href="https://discordbots.org/bot/452042500828299264"><img src="https://discordbots.org/api/widget/servers/452042500828299264.svg" alt="Discord Bots" /></a>
            <a class="m-1" href="https://discordbots.org/bot/452042500828299264"><img src="https://discordbots.org/api/widget/owner/452042500828299264.svg" alt="Discord Bots" /></a>
        </div>

        <div class="flex justify-center">
            <a class="bg-white text-black rounded px-2 py-1 mt-4 mx-1 hover:bg-gray-400 cursor-pointer" href="https://discordapp.com/oauth2/authorize?client_id=452042500828299264&permissions=67497024&scope=bot">Invite Snitch</a>
            <a class="bg-white text-black rounded px-2 py-1 mt-4 mx-1 hover:bg-gray-400 cursor-pointer" href="https://discord.gg/5FcKNvk">Support Server</a>
        </div>

        <div>
            <img class="mx-auto w-32" src="/img/snitch.png">
        </div>

        <div class="">
            <p><b> Word Notifications with emoji support and regExp! 🎉.</b></p>
            <p> Snitch will send you a Direct Message when someone in the server mentions a word you are subscribed too.</p>
            <p><b> Go to this particular message with one click!</b><p>
            <div>
                <img class="m-auto w-64" src="https://totally-not.a-sketchy.site/d503fa.png">
            </div>
            <br>
            <p> So for example: </p>
            <p> Every time someone says the word "cookie", the bot will send you a DM with the following info:<br> • Server <br> • Channel <br> • Mentioner <br> • Link <br></p>
            <p> You can easily remove a trigger when you decide you don't want to get notified anymore.<br>You can do this by reacting the red cross emoji to the last notification you got or use the <code class='inline'>listen!remove</code> command.</p>
            <button type="button" class="btn btn-success" onclick="window.open('https://discord.gg/5FcKNvk')">Snitch Support Server</button><br>
        </div>

        <div class="my-8">
            <h2> What is regex? </h2>
            <p> A regular expression is a special text string for describing a search pattern. You can think of regular expressions as wildcards on steroids. You are probably familiar with wildcard notations such as *.txt to find all text files in a file manager. The regex equivalent is .*\.txt. </p>
            <a href="https://regexr.com/" target="_blank">Handy website to build Regular Expressions</a>
        </div>
    </div>
</template>

<script>
const commands = {
    commands: {
        add: {
            title: "listen!add &lt;word&gt;",
            content: "Add a word to your trigger list.",
            example: [
                [
                    "Add the word \"Ecstabis\"",
                    "listen!add Ecstabis"
                ], [
                    "Add the emoji \"🍆\"",
                    "listen!add 🍆"
                ]
            ],
        },
        remove: {
            title: "listen!remove &lt;word&gt;",
            content: "Remove a word from your trigger list.",
            example: [
                [
                    "Remove the word \"Ecstabis\"",
                    "listen!remove Ecstabis"
                ]
            ],
        },
        addregex: {
            title: "listen!addRegex &lt;regExp&gt;",
            content: "Add a regExp to your trigger list.",
            example: [
                [
                    "Add the rexExp \"\\w*stabis\\b\"",
                    "listen!addRegex \\w*stabis\\b"
                ]
            ],
        },
        removeregex: {
            title: "listen!removeRegex &lt;regExp&gt;",
            content: "Remove a regExp to your trigger list.",
            example: [
                [
                    "Remove the rexExp \"\\w*stabis\\b\"",
                    "listen!removeRegex \\w*stabis\\b"
                ]
            ],
        },
        removeall: {
            title: "listen!removeAll",
            content: "Remove all triggers from your trigger list.",
        },
        ignore: {
            title: "listen!ignore <userid>",
            content: "The bot will ignore all messages from this user",
            example: [
                [
                    "Ignore Ecstabis with id",
                    "listen!ignore 261634894428372992"
                ],
                [
                    "Ignore Ecstabis with a mention",
                    "listen!ignore @Ecstabis#0001"
                ]
            ]
        },
        unignore: {
            title: "listen!unignore <userid>",
            content: "The bot will start listening to messages from this user",
            example: [
                [
                    "Unignore Ecstabis with id",
                    "listen!unignore 261634894428372992"
                ],
                [
                    "Unignore Ecstabis with a mention",
                    "listen!unignore @Ecstabis#0001"
                ]
            ]
        },
        list: {
            title: "listen!list",
            content: "Show all the triggers in your trigger list"
        },
        help: {
            title: "listen!help",
            content: "Shows these commands."
        },
        invite: {
            title: "listen!invite",
            content: "DM's you an invite to add this bot to your server"
        },
        stats: {
            title: "listen!stats",
            content: "Shows some fancy stats about the bot"
        }
    },
};

console.log(commands);

export default {

}
</script>
