import { shallowRef } from 'vue'
import { supabase } from '../supabase'

const bookmarkedIds = shallowRef<string[]>([])

export function useBookmarks() {
  const fetchBookmarks = async (userId: string) => {
    if (!userId) {
      bookmarkedIds.value = []
      return
    }
    const { data, error } = await supabase.from('favorites').select('norad_id').eq('user_id', userId)
    if (!error && data) {
      bookmarkedIds.value = data.map(row => row.norad_id)
    }
  }

  const toggleBookmark = async (userId: string, satellite: any) => {
    if (!userId || !satellite?.id) return

    const noradId = satellite.id.toString()
    const isFav = bookmarkedIds.value.includes(noradId)

    if (isFav) {
      bookmarkedIds.value = bookmarkedIds.value.filter(id => id !== noradId)
      await supabase.from('favorites').delete().match({ user_id: userId, norad_id: noradId })
    } else {
      bookmarkedIds.value = [...bookmarkedIds.value, noradId]
      await supabase.from('favorites').insert([{
        user_id: userId,
        norad_id: noradId,
        name: satellite.name
      }])
    }
  }

  const isBookmarked = (noradId: string) => {
    return bookmarkedIds.value.includes(noradId.toString())
  }

  return { bookmarkedIds, fetchBookmarks, toggleBookmark, isBookmarked }
}
