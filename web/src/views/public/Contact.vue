<template>
    <div class="w-full h-full md:w-3/4 lg:w-2/3 mx-auto flex flex-col items-center justify-center">
        <h1 class="text-4xl uppercase font-medium">Contact</h1>
        <div class="pt-12">
            <div class="w-32 flex flex-row items-center justify-between m-auto">
                <a class="hover:text-gray-500" href="https://github.com/jorenvandeweyer">
                    <font-awesome-icon class="text-4xl" :icon="github"/>
                </a>
                <a class="hover:text-gray-500" href="https://linkedid.com/in/jorenvandeweyer">
                    <font-awesome-icon class="text-4xl" :icon="linkedIn"/>
                </a>
                <a class="hover:text-gray-500" href="mailto:info@dupbit.com">
                    <font-awesome-icon class="text-4xl" :icon="email"/>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
export default {
    computed: {
        github () {
            return faGithub;
        },
        linkedIn () {
            return faLinkedin;
        },
        email () {
            return faEnvelope;
        }
    }
}
</script>
