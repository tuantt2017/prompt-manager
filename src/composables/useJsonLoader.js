import { usePromptStore } from "../store/promptStore";

export function useJsonLoader() {

    const store = usePromptStore();

    function load(file) {

        const reader = new FileReader();

        reader.onload = e => {

            store.prompts = JSON.parse(e.target.result);

        };

        reader.readAsText(file);

    }

    return {

        load

    };

}