module Jekyll
    module ExtractLanguageFilter
      def extract_language(input)
        input.scan(%r{\/(en|es|br)\/}).flatten.first || "en"
      end
    end
  end
  
  Liquid::Template.register_filter(Jekyll::ExtractLanguageFilter)
  