import { ref, shallowRef } from 'vue'
import { supabase } from '../supabase'

const bookmarkedIds = shallowRef<string[]>([])
const bookmarksList = ref<{ norad_id: string; name: string }[]>([])

export function useBookmarks() {
  const fetchBookmarks = async (userId: string) => {
    if (!userId) {
      bookmarkedIds.value = []
      bookmarksList.value = []
      return
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('norad_id, name')
      .eq('user_id', userId)

    if (!error && data) {
      bookmarkedIds.value = data.map(row => row.norad_id)
      bookmarksList.value = data
    }
  }

  const toggleBookmark = async (userId: string, satellite: { id: string | number; name: string }) => {
    if (!userId || !satellite?.id) return

    const noradId = satellite.id.toString()
    const isFav = bookmarkedIds.value.includes(noradId)

    if (isFav) {
      bookmarkedIds.value = bookmarkedIds.value.filter(id => id !== noradId)
      bookmarksList.value = bookmarksList.value.filter(b => b.norad_id !== noradId)

      await supabase.from('favorites').delete().match({ user_id: userId, norad_id: noradId })
    } else {
      const newFav = {
        user_id: userId,
        norad_id: noradId,
        name: satellite.name
      }

      bookmarkedIds.value = [...bookmarkedIds.value, noradId]
      bookmarksList.value = [...bookmarksList.value, { norad_id: noradId, name: satellite.name }]

      await supabase.from('favorites').insert([newFav])
    }
  }

  const isBookmarked = (noradId: string) => {
    return bookmarkedIds.value.includes(noradId.toString())
  }

  return {
    bookmarkedIds,
    bookmarksList,
    fetchBookmarks,
    toggleBookmark,
    isBookmarked
  }
}
