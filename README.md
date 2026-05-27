# 🛰️ Satellite Tracker 3D

Zaawansowana aplikacja internetowa do śledzenia satelitów na orbicie okołoziemskiej w czasie rzeczywistym. Zbudowana przy użyciu nowoczesnego stosu technologicznego, renderuje obiekty w pełnym 3D, wykorzystując surowe dane z bazy CelesTrak. 

Aplikacja wspiera autoryzację użytkowników i pozwala na tworzenie własnych list ulubionych obiektów (np. ISS, Starlink), synchronizowanych w chmurze dzięki Supabase.

## Główne funkcjonalności

- **Renderowanie 3D w czasie rzeczywistym:** Interaktywna kula ziemska z dynamicznie obliczanymi pozycjami satelitów na podstawie danych TLE.
- **Wyszukiwarka obiektów:** Szybkie odnajdywanie satelitów po nazwie lub unikalnym numerze katalogowym (NORAD ID).
- **Śledzenie i trajektorie:** Po wybraniu satelity kamera precyzyjnie centruje się na obiekcie i rysuje jego przewidywaną orbitę.
- **Autoryzacja użytkowników:** Bezpieczne logowanie za pomocą konta Google (OAuth) wdrożone przez Supabase.
- **Ulubione satelity (Zakładki):** Zalogowani użytkownicy mogą zapisywać satelity do prywatnej bazy danych. Zakładki są zabezpieczone na poziomie wierszy (Row Level Security - RLS).
- **Responsywny interfejs (Dock UI):** Nowoczesny, inspirowany systemem macOS dolny panel nawigacyjny, dostosowujący się do urządzeń mobilnych i desktopowych.
- **Integracja z N2YO:** Bezpośrednie linkowanie do szczegółowych danych zewnętrznych dla każdego obiektu.

## Stos technologiczny

- **Frontend:** Vue 3 (Composition API), TypeScript, Vite
- **Renderowanie 3D:** Three.js / Globe.gl
- **Backend & Auth:** Supabase (PostgreSQL, GoTrue Auth)
- **Źródło danych orbit:** CelesTrak (dane TLE)
- **Deployment:** Render.com

## Instalacja i uruchomienie lokalne

### Wymagania wstępne
- Node.js (wersja 18+)
- Konto w serwisie Supabase

### Klonowanie repozytorium
```bash
git clone [https://github.com/TwojLogin/satelite-tracker.git](https://github.com/TwojLogin/satelite-tracker.git)
cd satelite-tracker
```

### Instalacja zależności
```bash
npm install
```

### Zmienne środowiskowe
Utwórz plik `.env` w głównym katalogu projektu i uzupełnij go kluczami z Twojego projektu Supabase:
```env
VITE_SUPABASE_URL=twoj_adres_url_z_supabase
VITE_SUPABASE_ANON_KEY=twoj_anonimowy_klucz_z_supabase
```

### Uruchomienie serwera deweloperskiego
```bash
npm run dev
```
Aplikacja będzie dostępna pod adresem `http://localhost:5173`.

## Konfiguracja bazy danych (Supabase)

Aplikacja wykorzystuje bazę PostgreSQL w Supabase do przechowywania zakładek. Aby aplikacja działała poprawnie, musisz utworzyć tabelę i skonfigurować zasady prywatności. 

Wklej i uruchom poniższy skrypt w **SQL Editor** w swoim panelu Supabase:

```sql
-- Utworzenie tabeli
create table favorites (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users not null,
  norad_id text not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Włączenie Row Level Security (RLS)
alter table favorites enable row level security;

-- Zasady dostępu (tylko właściciel może widzieć i edytować swoje wpisy)
create policy "Widok tylko dla właściciela" on favorites for select using (auth.uid() = user_id);
create policy "Zapis tylko dla właściciela" on favorites for insert with check (auth.uid() = user_id);
create policy "Usuwanie tylko dla właściciela" on favorites for delete using (auth.uid() = user_id);
```

## Autoryzacja i Deployment

1. **Logowanie lokalne:** Aby logowanie Google działało na `localhost`, upewnij się, że w Supabase (`Authentication -> URL Configuration -> Redirect URLs`) masz dodany adres `http://localhost:5173/**`.
2. **Środowisko produkcyjne:** W przypadku wdrażania aplikacji na platformie Render, pamiętaj o:
   - Dodaniu adresu produkcyjnego (np. `https://satelite-tracker.onrender.com/**`) do *Redirect URLs* w Supabase.
   - Ustawieniu zmiennych środowiskowych `VITE_SUPABASE_URL` oraz `VITE_SUPABASE_ANON_KEY` w panelu (Environment) usługi hostingowej.

## Licencja

Projekt stworzony w celach edukacyjnych i demonstracyjnych. Dane o satelitach pochodzą z publicznych katalogów CelesTrak.
